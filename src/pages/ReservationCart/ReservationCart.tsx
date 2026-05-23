import React, { use, useEffect, useState } from "react";
import "./Cart.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import OutlineButton from "../../components/OutlineButton/OutlineButton";
import BlueButton from "../../components/BlueButton/BlueButton";
import CartItem from "../../components/CartItem/CartItem";
import { usePreorder } from "../../context/PreorderContext";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/Language";
import ReservationItem from "../../components/Reservation/ReservationItem/ReservationItem";
import { log } from "console";
import { useParams } from "react-router-dom";

const ReservationCart: React.FC = () => {
  const { preorderCart, getPreorderCart, updatePreorderItemQuantity } =
    usePreorder();
  const { currentLanguage } = useLanguage();
  const { id } = useParams();
  const [changes, setChanges] = useState<{ [key: string]: number }>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const { discount } = useAuth();
  const [isCartEmpty, setIsCartEmpty] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<string>("");
  useEffect(() => {
    let interval: NodeJS.Timeout;
    // Check if the cart includes an expiration timestamp.
    if (preorderCart && (preorderCart as any).expiresAt) {
      interval = setInterval(() => {
        const expiresAt = new Date((preorderCart as any).expiresAt).getTime();
        const now = Date.now();
        const diff = expiresAt - now;
        if (diff <= 0) {
          setTimeLeft("Expired");
          clearInterval(interval);
          if (preorderCart?.items.length > 0) {
            window.location.reload();
          }
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [preorderCart]);
  console.log(preorderCart);
  useEffect(() => {
    if (preorderCart && preorderCart.items) {
      const total = preorderCart.items.reduce((acc: number, item: any) => {
        const price = item?.product?.salePrice || item?.product?.price || 0;
        return acc + price * item?.quantity;
      }, 0);
      setTotalPrice(total);
      setIsCartEmpty(preorderCart.items.length === 0);
    }
  }, [preorderCart, discount]);

  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isCartEmpty || timeLeft === "Expired") {
      event.preventDefault();
    }
  };

  return (
    <div>
      <Header />
      <div className="cart-wrapper">
        <div className="cart-middle">
          <h2>
            {currentLanguage === "en"
              ? " Reservation cart"
              : "Shporta e ngarkesave"}
          </h2>
          {isCartEmpty ? (
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
                  ? "Your cart is empty. Please add products"
                  : "Shporta juaj është bosh. Ju lutemi shtoni artikuj në shportë."}
              </h5>
            </div>
          ) : (
            <>
              <div className="cart-boxes">
                {preorderCart?.items?.map((item: any) => (
                  <ReservationItem key={item.id} item={item} />
                ))}
              </div>

              <div className="reservation-cart-buttons-wrapper">
                <div className="cart-buttons-top">
                  <div className="cart-buttons">
                    {timeLeft && timeLeft !== "Expired" && (
                      <span className="cart-timer">
                        {" "}
                        Expires in <span>{timeLeft}</span>
                      </span>
                    )}
                    {timeLeft === "Expired" && (
                      <span className="cart-timer expired"> Cart expired</span>
                    )}
                  </div>
                </div>
                <div className="cart-buttons-bottom">
                  <div className="totali-text">
                    <h5>
                      {currentLanguage === "en"
                        ? "Order total"
                        : "Totali i porosisë"}
                    </h5>
                    <p>
                      {preorderCart?.items?.length === 1
                        ? currentLanguage === "en"
                          ? "1 product"
                          : "1 artikull"
                        : currentLanguage === "en"
                        ? `${preorderCart?.items?.length} products`
                        : `${preorderCart?.items?.length} artikuj`}
                    </p>
                  </div>
                  <div className="totalPrice">{totalPrice.toFixed(2)}€</div>
                  <a href={`/reservation/checkout/${id}`} onClick={handleNavigation}>
                    <BlueButton
                      disabled={isCartEmpty || timeLeft === "Expired"}
                    >
                      {currentLanguage === "en" ? "Checkout" : "Përfundo"}
                    </BlueButton>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReservationCart;
