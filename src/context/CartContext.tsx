import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import axiosInstance from "../services/axiosInstance";

interface CartItem {
  id: string;
  productData: any;
  quantity: number;
}

interface Cart {
  id?: string;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart;
  cartCount: number;
  getCart: (userId: string) => Promise<void>;
  addItem: (
    userId: string,
    productData: any,
    quantity: number
  ) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [cartCount, setCartCount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );
  const token = localStorage.getItem("token");

  // Update cart count dynamically
  useEffect(() => {
    const newCount = cart?.items?.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setCartCount(newCount);
  }, [cart]);

  // Fetch cart from API
  const getCart = async (userId: string) => {
    try {
      const { data } = await axiosInstance.get(`/cart/${userId}`);
      setCart(data || { items: [] });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart({ items: [] });
    }
  };

  // Function to check for userId changes
  const checkUserId = useCallback(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId !== userId) {
      setUserId(storedUserId);
    }
  }, [userId]);

  // Listen for changes in localStorage (e.g., after login)
  useEffect(() => {
    window.addEventListener("storage", checkUserId);
    return () => {
      window.removeEventListener("storage", checkUserId);
    };
  }, [checkUserId]);

  // Fetch cart whenever userId is available
  useEffect(() => {
    if (userId) {
      getCart(userId);
    }
  }, [userId]);

  const addItem = async (
    userId: string,
    productData: any,
    quantity: number
  ) => {
    try {
      const { images, ...restProductData } = productData || {};
      const trimmedProductData = {
        ...restProductData,
        images: images?.[0] ? [images[0]] : [],
      };
      await axiosInstance.post(
        "/cart/items",
        {
          userId,
          productData: trimmedProductData,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      getCart(userId);
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await axiosInstance.delete(`/cart/items/${itemId}`);
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart?.items?.filter((item) => item.id !== itemId) || [],
      }));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    try {
      await axiosInstance.patch(`/cart/items/${itemId}`, { quantity });
      setCart((prevCart) => ({
        ...prevCart,
        items:
          prevCart?.items?.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ) || [],
      }));
    } catch (error) {
      console.error("Failed to update item quantity:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        getCart,
        addItem,
        removeItem,
        updateItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartProvider;
