import { useState } from "react";
import "./ReservationItem.scss";
import cancel from "../../../assets/svg/serviceCartBoxCancel.svg";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/Language";
import { usePreorder } from "../../../context/PreorderContext";

const ReservationItem = ({ item, checkout }: any) => {
  const { currentLanguage } = useLanguage();
  const { currentUser } = useAuth();
  const { discount } = useAuth();
  const { removePreorderItem } = usePreorder();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleRemove = () => {
    removePreorderItem(currentUser.id, item?.product?.id);
  };

  const basePrice = item?.product?.salePrice || item?.product?.price || 0;
  const discountedPrice = basePrice.toFixed(2);

  return (
    <div className="cart-box">
      {!checkout && (
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
      )}
      <div className="cart-box-left">
        <div className="cart-item-image">
          <img src={item?.product?.images[0] && item?.product?.images[0]?.url} alt={item?.product?.name} />
        </div>
        <div className="cart-box-left-details">
          <div className="cart-item-description">
            <h5>{item?.product?.name}</h5>
            {item?.product?.extra2 !== "Aksesorë" && (
              <p>
                {currentLanguage === "en" ? "Brand" : "Marka"}:{" "}
                <span>{item?.product?.marka}</span>
              </p>
            )}
            <p>
              {currentLanguage === "en" ? "Category" : "Kategoria"}:{" "}
              <span>{item?.product?.category}</span>
            </p>
          </div>
          <div className="cart-box-counter">
            <p>{currentLanguage === "en" ? "Quantity" : "Sasia"}: </p>
            <span>{quantity}</span>
          </div>
        </div>
      </div>
      <div className="cart-box-right">
        {checkout ? (
          <div className="cart-remove-button" />
        ) : (
          <div className="cart-remove-button" onClick={handleRemove}>
            <img src={cancel} alt="Remove" />
            <span>
              {currentLanguage === "en" ? "Remove Product" : "Largo Produktin"}
            </span>
          </div>
        )}
        <div className="cart-total">
          <h3>
            {discountedPrice}/{currentLanguage === "en" ? "unit" : "copë"} €
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ReservationItem;
