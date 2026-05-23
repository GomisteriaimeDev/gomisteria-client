import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axiosInstance from "../services/axiosInstance";

interface WishlistItem {
  id: string;
  productData: any;
  uniqueIdentifier: string;
}



interface WishlistContextType {
  wishlist: any;
  wishlistCount: number;
  getWishlist: () => Promise<void>;
  addItemToWishlist: (
    productData: any,
    uniqueIdentifier: string
  ) => Promise<void>;
  removeItemFromWishlist: (uniqueIdentifier: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<any>({ items: [] });
  const [wishlistCount, setWishlistCount] = useState<number>(0);

  useEffect(() => {
    setWishlistCount(wishlist.items.length);
  }, [wishlist]);

  const getWishlist = async () => {
    try {
      const { data } = await axiosInstance.get(`/wishlist`);
      const parsedWishlist = data.map((item: any) => ({
        id: item.sortID,
        productData: item,
        uniqueIdentifier: item.barcode,
      }));
      setWishlist({ items: parsedWishlist });
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getWishlist();
    }
  }, []);

  const addItemToWishlist = async (
    productData: any,
    uniqueIdentifier: string
  ) => {
    try {
      await axiosInstance.post(`/wishlist/add`, {
        productData,
        uniqueIdentifier,
      });
      getWishlist();
    } catch (error) {
      console.error("Failed to add item to wishlist:", error);
    }
  };

  const removeItemFromWishlist = async (uniqueIdentifier: string) => {
    try {
      await axiosInstance.delete(`/wishlist/remove`, {
        data: { uniqueIdentifier: uniqueIdentifier.toString() },
      });
      setWishlist((prevWishlist:any) => ({
        items: prevWishlist.items.filter(
          (item:any) => item.uniqueIdentifier !== uniqueIdentifier
        ),
      }));
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        getWishlist,
        addItemToWishlist,
        removeItemFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export default WishlistProvider;
