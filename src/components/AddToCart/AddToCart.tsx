import React, { useEffect, useState } from "react";
import "./AddToCart.scss";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
interface AddToCartProps {
  productData: any;
  category: string;
  quantity?: number;
  currentLanguage?: string;
}

const AddToCart: React.FC<AddToCartProps> = ({
  productData,
  category,
  quantity,
  currentLanguage,
}) => {
  const { addItem } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<{
    product: any;
    qty: number;
  } | null>(null);

  const handleClick = () => {
    const finalQuantity = quantity ?? (category === "Fellne" ? 4 : 1);

    if (currentUser) {
      addItem(currentUser.id, productData, finalQuantity);

      setLastAdded({ product: productData, qty: finalQuantity });
      setIsModalOpen(true);
    } else {
      console.error("User ID not found or addItem method is not available");
    }
  };

  return (
    <>
      <button className="blueButtonComponentAddToCart" onClick={handleClick}>
        {currentLanguage === "en" ? "Add to cart" : "Shto në shportë"}
      </button>

      <AddedToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={lastAdded?.product}
        quantity={lastAdded?.qty ?? 1}
        currentLanguage={currentLanguage}
        onContinueShopping={() => setIsModalOpen(false)}
        onGoToCheckout={() => navigate("/cart")}
      />
    </>
  );
};

export default AddToCart;

type AddedToCartModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  quantity: number;
  currentLanguage?: string;
  onGoToCheckout?: () => void;
  onContinueShopping?: () => void;
};
const getName = (p: any) => p?.name ?? p?.title ?? p?.productName ?? "Product";
const getImage = (p: any) =>
  p?.images?.[0] ?? p?.img ?? p?.imageUrl ?? p?.thumbnail ?? "";
const getPrice = (p: any) => p?.price ?? p?.finalPrice ?? p?.unitPrice ?? null;

export const AddedToCartModal: React.FC<AddedToCartModalProps> = ({
  isOpen,
  onClose,
  product,
  quantity,
  currentLanguage,
  onGoToCheckout,
  onContinueShopping,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const name = getName(product);
  const img = getImage(product);
  const price = getPrice(product);

  const t = {
    title: currentLanguage === "en" ? "Added to cart" : "Shtuar në shportë",
    desc:
      currentLanguage === "en"
        ? "The item was added to your cart."
        : "Artikulli u shtua në shportë",
    qty: currentLanguage === "en" ? "Qty" : "Sasia",
    continue:
      currentLanguage === "en" ? "Continue shopping" : "Kthehu në shopping",
    checkout:
      currentLanguage === "en" ? "Proceed to cart" : "Vazhdo tek shporta",
  };

  return createPortal(
    <div
      className="atcModalOverlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="atcModal" onClick={(e) => e.stopPropagation()}>
        <button className="atcClose" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="atcHeader">
          <div className="atcTitle">{t.title}</div>
          <div className="atcSubtitle">{t.desc}</div>
        </div>

        <div className="atcBody">
          {img ? (
            <img className="atcImg" src={img} alt={name} />
          ) : (
            <div className="atcImgPlaceholder" />
          )}

          <div className="atcInfo">
            <div className="atcName">{name}</div>

            <div className="atcMetaRow">
              <span className="atcMetaLabel">{t.qty}:</span>
              <span className="atcMetaValue">{quantity}</span>
            </div>

            {price != null && (
              <div className="atcMetaRow">
                <span className="atcMetaLabel">Price:</span>
                <span className="atcMetaValue">{price}</span>
              </div>
            )}
          </div>
        </div>

        <div className="atcFooter">
          <button
            className="atcBtn atcBtnSecondary"
            onClick={() => {
              onContinueShopping?.();
              onClose();
            }}
          >
            {t.continue}
          </button>

          <button
            className="atcBtn atcBtnPrimary"
            onClick={() => onGoToCheckout?.()}
          >
            {t.checkout}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
