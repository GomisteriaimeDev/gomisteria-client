import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUserById, getDiscounts } from "../services/api";
import { jwtDecode } from "jwt-decode";
import { useCart } from "./CartContext";

interface AuthContextType {
  currentUser: any;
  isAuthenticated: boolean;
  discount: number;
  token?: string;
  priceHidden: boolean;
  setPriceHidden: (hidden: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE = "https://gomisteria-api.onrender.com";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [priceHidden, setPriceHidden] = useState(false);
  const navigate = useNavigate();
  const { getCart } = useCart();

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAuthenticated");
    setCurrentUser(null);
    navigate("/");
  }, [navigate]);

  const setSessionTimeout = useCallback(
    (expTime: number) => {
      const currentTime = Date.now();
      const timeUntilExpiration = expTime * 1000 - currentTime;
      if (timeUntilExpiration <= 0) {
        logout();
        return;
      }
      setTimeout(logout, timeUntilExpiration);
    },
    [logout]
  );

  const login = useCallback(async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE}/api/users/login`, {
      email,
      password,
    });

    const token = response.data.access_token;
    const decodedToken = jwtDecode<any>(token);

    localStorage.setItem("token", token);
    localStorage.setItem("userId", decodedToken.sub);
    localStorage.setItem("isAuthenticated", "true");

    setIsAuthenticated(true);

    // optional: set auto-logout timer based on exp
    if (decodedToken?.exp) setSessionTimeout(decodedToken.exp);

    // If you want to immediately fetch user/cart after login, you can do it here:
    // await getCart();
  }, [setSessionTimeout]);

  const updateUser = useCallback(
    async (userData: any) => {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put(`${API_BASE}/api/users/${currentUser.id}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCurrentUser({ ...currentUser, ...userData });
      window.location.reload();
    },
    [currentUser]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchUserAndDiscounts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const decodedToken: any = jwtDecode(token);

      // expired
      if (decodedToken.exp * 1000 < Date.now()) {
        logout();
        return;
      }

      // keep session timer in sync
      if (decodedToken?.exp) setSessionTimeout(decodedToken.exp);

      try {
        const [userData, discountData] = await Promise.all([
          getUserById(decodedToken.sub, token),
          getDiscounts(),
        ]);

        setCurrentUser(userData);
        setIsAuthenticated(true);

        const normalize = (s?: string) => s?.toLowerCase().replace(/\s+/g, '') ?? '';
        const userDiscount = discountData.find(
          (d: any) =>
            d.type === userData.role ||
            normalize(d.type) === normalize(userData.specialFields?.businessType)
        );

        setDiscount(userDiscount ? userDiscount.value : 0);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndDiscounts();
  }, [logout, setSessionTimeout]);

  const value = {
    currentUser,
    isAuthenticated,
    discount,
    priceHidden,
    setPriceHidden,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
