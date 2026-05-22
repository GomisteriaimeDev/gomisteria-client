import React, { useEffect, useState } from "react";
import "./Cart.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import OutlineButton from "../../components/OutlineButton/OutlineButton";
import BlueButton from "../../components/BlueButton/BlueButton";
import CartItem from "../../components/CartItem/CartItem";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/Language";

const Cart: React.FC = () => {
  const { cart, getCart, updateItemQuantity } = useCart();
  const { currentLanguage } = useLanguage();
  const [changes, setChanges] = useState<{ [key: string]: number }>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const { discount } = useAuth();
  const [isCartEmpty, setIsCartEmpty] = useState<boolean>(true);

  useEffect(() => {
    // Initialize notes from localStorage
    const storedNotes = localStorage.getItem("cartNotes");
    if (storedNotes) {
      setNotes(storedNotes);
    }
  }, []);

  useEffect(() => {
    // Calculate the total price whenever the cart changes and check if the cart is empty
    if (cart && cart?.items) {
      const total = cart?.items?.reduce((acc: number, item: any) => {
        if (discount) {
          return (
            acc +
            (item?.productData?.price -
              item?.productData?.price * (discount / 100)) *
              item?.quantity
          );
        } else {
          return acc + item?.productData?.price * item?.quantity;
        }
      }, 0);
      setTotalPrice(total);
      setIsCartEmpty(cart.items.length === 0);
    }
    console.log(cart);
  }, [cart]);

  const handleQuantityUpdates = (itemId: string, newQuantity: number) => {
    setChanges((prev) => ({ ...prev, [itemId]: newQuantity }));
  };

  const saveChanges = async () => {
    const promises = [];
    for (const [itemId, quantity] of Object.entries(changes)) {
      promises.push(updateItemQuantity(itemId, quantity));
    }
    try {
      await Promise.all(promises);
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
    window.location.reload();
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = event.target.value;
    setNotes(newNotes);
    localStorage.setItem("cartNotes", newNotes);
  };

  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isCartEmpty) {
      event.preventDefault();
    }
  };

  return (
    (
      <div>
        <Header />
        <div className="cart-wrapper">
          <div className="cart-middle">
            <h2>
              {currentLanguage === "en"
                ? "Product cart"
                : "Shporta e produkteve"}
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
                  {cart?.items?.map((item: any) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityUpdates}
                    />
                  ))}
                </div>
                <div className="cart-notes">
                  <label htmlFor="cartNotes">
                    {currentLanguage === "en" ? "Notes" : "Shënime"}:
                  </label>
                  <textarea
                    name="cartNotes"
                    value={notes}
                    onChange={handleNotesChange}
                  />
                </div>
                <div className="cart-buttons-wrapper">
                  <div className="cart-buttons-top">
                    <div className="cart-save-button">
                      <OutlineButton
                        onClick={saveChanges}
                        disabled={isCartEmpty}
                      >
                        {currentLanguage === "en"
                          ? "Save changes"
                          : " Ruaj ndryshimet"}
                      </OutlineButton>
                    </div>
                    <div className="cart-buttons">
                      <a href="/" onClick={handleNavigation}>
                        <OutlineButton disabled={isCartEmpty}>
                          {currentLanguage === "en" ? "Cancel" : "Anulo"}
                        </OutlineButton>
                      </a>
                      <a href="/cart/checkout" onClick={handleNavigation}>
                        <BlueButton disabled={isCartEmpty}>
                          {currentLanguage === "en" ? "Checkout" : "Përfundo"}
                        </BlueButton>
                      </a>
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
                        {cart?.items?.length === 1
                          ? currentLanguage === "en"
                            ? "1 product"
                            : "1 artikull"
                          : currentLanguage === "en"
                          ? `${cart?.items?.length} products`
                          : `${cart?.items?.length} artikuj`}
                      </p>
                    </div>
                    <div className="totalPrice">{totalPrice.toFixed(2)}€</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    )
  );
};

export default Cart;
