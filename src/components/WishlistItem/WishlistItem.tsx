import "./WishlistItem.scss";
import cancel from "../../assets/svg/serviceCartBoxCancel.svg";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useLanguage } from "../../context/Language";
import AddToCart from "../AddToCart/AddToCart";

const WishlistItem = ({ item }: any) => {
  const { currentLanguage } = useLanguage();
  const { discount } = useAuth();
  const { removeItemFromWishlist } = useWishlist();

  const handleRemove = () => {
    removeItemFromWishlist(item.uniqueIdentifier.toString());
  };
  const discountedPrice = discount
    ? (
        item?.productData.price -
        item?.productData?.price * (discount / 100)
      ).toFixed(2)
    : item?.productData?.price.toFixed(2);

  return (
    <div className="cart-box">
      <svg
        className="red-mobile-remove"
        onClick={handleRemove}
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M15 5L5 15M5 5L15 15"
          stroke="#F7685B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="cart-box-left">
        <div className="cart-item-image">
          {discount > 0 && <span className="sale">-{discount}%</span>}
          {item?.productData?.images[0] ? (
            <img
              src={item?.productData?.images[0]}
              alt={item.productData.description}
            />
          ) : (
            <p>no image</p>
          )}
        </div>
        <div className="cart-box-left-details">
          <a
            href={`/${item?.productData?.extra2.toLowerCase()}/${
              item?.productData?.code
            }`}
            className="cart-item-description"
          >
            <h5>{item.productData.description}</h5>
            {item?.productData?.extra2 === "Gomë" ? (
              <p>
                {currentLanguage === "en" ? "Season" : "Sezona"}:{" "}
                <span>{item?.productData?.klasifikimi4}</span>
              </p>
            ) : null}
            {item?.productData.brand && (
              <p>
                {currentLanguage === "en" ? "Brand" : "Marka"}:{" "}
                <span>{item.productData.brand}</span>
              </p>
            )}
            {item.productData.extra2 && (
              <p>
                {currentLanguage === "en" ? "Category" : "Kategoria"}:{" "}
                <span>{item.productData.extra2}</span>
              </p>
            )}
             {item.productData.warehouses[0] && (
              <p>
                {currentLanguage === "en" ? "Warehouse" : "Depo"}:{" "}
                <span>
                  {item?.productData?.warehouses[0].quantityAvailable > 20
                    ? "20+"
                    : `${item?.productData?.warehouses[0].quantityAvailable} në stok`}
                </span>
              </p>
            )}
          </a>
          <div style={{ maxWidth: "200px", width: "100%" }}>
            <AddToCart
              currentLanguage={currentLanguage}
              productData={item.productData}
              category={item?.productData?.extra2}
            />
          </div>
        </div>
      </div>
      <div className="cart-box-right-wishlist">
        <div className="cart-remove-button" onClick={handleRemove}>
          <img src={cancel} alt="Remove" />
          <span>
            {currentLanguage === "en" ? "Remove Product" : "Largo Produktin"}
          </span>
        </div>
        <div className="cart-total">
          {discountedPrice === item.productData.price ? (
            <h5 className="strikethrough">
              {item.productData.price
                ? item.productData.price.toFixed(2)
                : null}
              €
            </h5>
          ) : null}
          <h3>
            {discountedPrice}/{currentLanguage === "en" ? "unit" : "cope"} €
          </h3>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
