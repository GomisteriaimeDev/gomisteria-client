import React, { useEffect, useMemo, useState } from "react";
import "./CartItem.scss";
import { ICartItem } from "../../utils/Types";
import cancel from "../../assets/svg/serviceCartBoxCancel.svg";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/Language";

interface CartItemProps {
  item: ICartItem;
  onQuantityChange?: (itemId: string, newQuantity: number) => void;
  checkout?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  checkout,
}) => {
  const { currentLanguage } = useLanguage();
  const { discount } = useAuth();
  const { removeItem } = useCart();

  const [quantity, setQuantity] = useState(item.quantity);

  // Keep local state in sync if parent/cart updates the item quantity externally
  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  // Step size rule: rims ("Fellne") in 4s, everything else in 1s
  const step = useMemo(() => {
    return item?.productData?.extra2 === "Fellne" ? 4 : 1;
  }, [item?.productData?.extra2]);

  // Max available stock: sum across warehouses (future-proof)
  const maxAvailable = useMemo(() => {
    const warehouses = item?.productData?.warehouses ?? [];
    return warehouses.reduce(
      (sum: any, w: any) => sum + (w.quantityAvailable ?? 0),
      0
    );
  }, [item?.productData?.warehouses]);

  const minQuantity = step;

  // Cart items no longer store base64 images; resolve the product image from the
  // prodata image endpoint by code. Fall back to any inline image (legacy items).
  const imageSrc = useMemo(() => {
    const inline = item?.productData?.images?.[0];
    if (inline) return inline;
    const code = item?.productData?.code;
    return code
      ? `https://gomisteria-api.onrender.com/api/prodata/image/${code}/1`
      : undefined;
  }, [item?.productData?.images, item?.productData?.code]);

  const handleDecrement = () => {
    const newQuantity = quantity - step;
    if (newQuantity >= minQuantity) {
      setQuantity(newQuantity);
      onQuantityChange?.(item.id, newQuantity);
    }
  };

  const handleIncrement = () => {
    const newQuantity = quantity + step;
    if (newQuantity <= maxAvailable) {
      setQuantity(newQuantity);
      onQuantityChange?.(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  const discountedPrice = discount
    ? (
        item?.productData?.price -
        item?.productData?.price * (discount / 100)
      ).toFixed(2)
    : item?.productData?.price?.toFixed(2);

  const canIncrement = quantity + step <= maxAvailable;
  const canDecrement = quantity - step >= minQuantity;

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
          <img src={imageSrc} alt={item?.productData?.description} />
        </div>

        <div className="cart-box-left-details">
          <div className="cart-item-description">
            <h5>{item?.productData?.description}</h5>

            {item?.productData?.extra2 !== "Aksesorë" ? (
              <p>
                {currentLanguage === "en" ? "Brand" : "Marka"}:{" "}
                <span>{item?.productData?.brand}</span>
              </p>
            ) : null}

            <p>
              {currentLanguage === "en" ? "Category" : "Kategoria"}:{" "}
              <span>{item?.productData?.extra2}</span>
            </p>

            {/* Optional: show stock */}
            {/* <p>
              {currentLanguage === "en" ? "Available" : "Në dispozicion"}:{" "}
              <span>{maxAvailable}</span>
            </p> */}
          </div>

          <div className="cart-box-counter">
            <p>{currentLanguage === "en" ? "Quantity" : "Sasia"}: </p>

            {checkout ? null : (
              <button onClick={handleDecrement} disabled={!canDecrement}>
                -
              </button>
            )}

            <span>{quantity}</span>

            {checkout ? null : (
              <button onClick={handleIncrement} disabled={!canIncrement}>
                +
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="cart-box-right">
        {checkout ? (
          <div className="cart-remove-button">
            <></>
          </div>
        ) : (
          <div className="cart-remove-button" onClick={handleRemove}>
            <img src={cancel} alt="Remove" />
            <span>
              {currentLanguage === "en" ? "Remove Product" : "Largo Produktin"}
            </span>
          </div>
        )}

        <div className="cart-total">
          {/* If you want to show old price when discounted, compare numbers not strings */}
          {discount > 0 ? (
            <h5 className="strikethrough">
              {item?.productData?.price?.toFixed(2)}€
            </h5>
          ) : null}

          <h3>
            {discountedPrice}/{currentLanguage === "en" ? "unit" : "copë"} €
          </h3>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
