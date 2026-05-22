import styles from "./Wishlist.module.scss";
import AccountPageNav from "../../../components/AccountPageNav/AccountPageNav";
import Header from "../../../components/Header/Header";
import { useWishlist } from "../../../context/WishlistContext";
import { useAuth } from "../../../context/AuthContext";
import WishlistItem from "../../../components/WishlistItem/WishlistItem";
import { useLanguage } from "../../../context/Language";
const Wishlist = () => {
  const { wishlist, removeItemFromWishlist } = useWishlist();
  const { currentLanguage } = useLanguage();
  const { currentUser } = useAuth();
  const handleClick = ({ productId }: any) => {
    if (currentUser) {
      removeItemFromWishlist(productId);
    } else {
      console.error(
        "User ID not found or addItemToWishlist method is not available"
      );
    }
  };
  return (
    <div>
      <Header />
      <div className="account-wrapper">
        <AccountPageNav />
        <div className={styles.wishlistWrapper}>
          <h2>{currentLanguage === "en" ? "Wishlist" : "Lista e dëshirave"}</h2>
          <div className={styles.productList}>
            {wishlist?.items?.length ? (
              wishlist?.items?.map((item: any, index: any) => (
                <div className={styles.wishlistItem} key={index}>
                  <WishlistItem
                    key={item.id}
                    item={item}
                    onRemove={handleClick}
                  />
                </div>
              ))
            ) : (
              <div className="empty-cart-message">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7b7b7b"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-package"
                >
                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <h5>
                  {currentLanguage === "en"
                    ? "Your wishlist is empty. Please add products."
                    : "  Lista juaj e dëshirave është bosh. Ju lutemi shtoni artikuj në listë."}
                </h5>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
