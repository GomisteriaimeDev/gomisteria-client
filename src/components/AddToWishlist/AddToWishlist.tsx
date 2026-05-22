import React from "react";
import "./AddToWishlist.scss";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

interface AddToWishlistProps {
  productData: any;
}

const AddToWishlist: React.FC<AddToWishlistProps> = ({ productData }) => {
  const { addItemToWishlist, removeItemFromWishlist, wishlist } = useWishlist();
  const { currentUser } = useAuth();

  const uniqueIdentifier = productData.barcode.toString();

  const isItemInWishlist = wishlist.items.some(
    (item: any) => item.uniqueIdentifier === uniqueIdentifier
  );
  const handleClick = () => {
    if (currentUser) {
      if (isItemInWishlist) {
        removeItemFromWishlist(uniqueIdentifier);
      } else {
        addItemToWishlist(productData, uniqueIdentifier);
      }
    } else {
      console.error(
        "User ID not found or addItemToWishlist method is not available"
      );
    }
  };

  return (
    <div className="addToWishlistBtn" onClick={handleClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isItemInWishlist ? "#1e8ca5" : "none"}
        stroke="#1e8ca5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-heart"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </div>
  );
};

export default AddToWishlist;
