import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import axiosInstance from "../services/axiosInstance";

interface PreorderCartItem {
  id: string;
  productNgarkesa: any; // Contains product details from the backend
  quantity: number;
}

interface PreorderCart {
  id?: string;
  items: PreorderCartItem[];
}

interface PreorderContextType {
  preorderCart: PreorderCart;
  preorderCartCount: number;
  getPreorderCart: (userId: string) => Promise<void>;
  addPreorderItem: (
    userId: string,
    productNgarkesaId: string,
    quantity: number,
    ngarkesaId: string
  ) => Promise<void>;
  updatePreorderItemQuantity: (
    userId: string,
    productNgarkesaId: string,
    quantity: number
  ) => Promise<void>;
  removePreorderItem: (
    userId: string,
    productNgarkesaId: string
  ) => Promise<void>;
  clearPreorderCart: (userId: string) => Promise<void>;
}

const PreorderContext = createContext<PreorderContextType | undefined>(
  undefined
);

const PreorderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preorderCart, setPreorderCart] = useState<PreorderCart>({ items: [] });
  const [preorderCartCount, setPreorderCartCount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );

  // Update cart count dynamically
  useEffect(() => {
    const newCount = preorderCart?.items?.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setPreorderCartCount(newCount);
  }, [preorderCart]);

  // Fetch the preorder cart from the backend.
  // With the new backend logic, the cart might be null (if expired),
  // so we default to an empty cart.
  const getPreorderCart = async (userId: string) => {
    try {
      const { data } = await axiosInstance.get(`/ngarkesa-cart/${userId}`);
      setPreorderCart(data || { items: [] });
    } catch (error) {
      console.error("Failed to fetch preorder cart:", error);
      setPreorderCart({ items: [] });
    }
  };

  // Helper to monitor potential changes to userId (e.g., after login)
  const checkUserId = useCallback(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId !== userId) {
      setUserId(storedUserId);
    }
  }, [userId]);

  useEffect(() => {
    window.addEventListener("storage", checkUserId);
    return () => {
      window.removeEventListener("storage", checkUserId);
    };
  }, [checkUserId]);

  useEffect(() => {
    if (userId) {
      getPreorderCart(userId);
    }
  }, [userId]);

  const addPreorderItem = async (
    userId: string,
    productNgarkesaId: string,
    quantity: number
  ) => {
    try {
      await axiosInstance.post(`/ngarkesa-cart/${userId}/add`, {
        productNgarkesaId,
        quantity,
      });
      getPreorderCart(userId);
    } catch (error) {
      console.error("Failed to add preorder item:", error);
    }
  };

  const updatePreorderItemQuantity = async (
    userId: string,
    productNgarkesaId: string,
    quantity: number
  ) => {
    try {
      await axiosInstance.patch(`/ngarkesa-cart/${userId}/update`, {
        productNgarkesaId,
        quantity,
      });
      getPreorderCart(userId);
    } catch (error) {
      console.error("Failed to update preorder item quantity:", error);
    }
  };

  const removePreorderItem = async (
    userId: string,
    productNgarkesaId: string
  ) => {
    try {
      await axiosInstance.delete(`/ngarkesa-cart/${userId}/remove`, {
        params: { productNgarkesaId },
      });
      setPreorderCart((prevCart) => ({
        ...prevCart,
        items:
          prevCart?.items?.filter(
            (item) => item.productNgarkesa?.id !== productNgarkesaId
          ) || [],
      }));
    } catch (error) {
      console.error("Failed to remove preorder item:", error);
    }
  };

  const clearPreorderCart = async (userId: string) => {
    try {
      await axiosInstance.delete(`/ngarkesa-cart/${userId}/clear`);
      setPreorderCart({ items: [] });
    } catch (error) {
      console.error("Failed to clear preorder cart:", error);
    }
  };

  return (
    <PreorderContext.Provider
      value={{
        preorderCart,
        preorderCartCount,
        getPreorderCart,
        addPreorderItem,
        updatePreorderItemQuantity,
        removePreorderItem,
        clearPreorderCart,
      }}
    >
      {children}
    </PreorderContext.Provider>
  );
};

export const usePreorder = (): PreorderContextType => {
  const context = useContext(PreorderContext);
  if (context === undefined) {
    throw new Error("usePreorder must be used within a PreorderProvider");
  }
  return context;
};

export default PreorderProvider;
