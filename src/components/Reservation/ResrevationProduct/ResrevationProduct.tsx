import React, { useState } from "react";
import "./ResrevationProduct.scss";
import capitalize from "../../../utils/Capitalize";
import BlueButton from "../../BlueButton/BlueButton";
import ReservationModal from "../ReservationModal/ReservationModal";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/Language";
import { usePreorder } from "../../../context/PreorderContext";

const ResrevationProduct = ({ productData, productNgarkesaId }: any) => {
  const { currentLanguage } = useLanguage();
  const [isModalOpen, setModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addPreorderItem } = usePreorder();
  const { id: ngarkesaId } = useParams();
  const toggleModal = () => setModalOpen(!isModalOpen);

  const handleDecrement = () => {
    if (productData?.category === "fellne") {
      if (quantity > 4) {
        setQuantity(quantity - 4);
      }
    } else {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    }
  };

  const handleIncrement = () => {
    const stock = productData?.stock ?? 0;
    if (productData?.category === "fellne") {
      if (quantity + 4 <= stock) {
        setQuantity(quantity + 4);
      }
    } else {
      if (quantity + 1 <= stock) {
        setQuantity(quantity + 1);
      }
    }
  };

  const handleSubmit = async (event: any, ngarkesaId: any) => {
    event.preventDefault();
    if (!currentUser?.id) {
      console.error("User not logged in");
      return;
    }
    try {
      // Call the context function to add a preorder item
      await addPreorderItem(
        currentUser.id,
        productNgarkesaId,
        quantity,
        ngarkesaId
      );
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to add preorder item:", error);
    }
  };
  console.log(productData);
  return (
    <div className="reservationProduct-item">
      <a href={`/${productData?.category.toLowerCase()}/${productData?.id}`}>
        <img
          src={productData?.images[0]?.url}
          alt=""
          className="reservationProduct-image"
        />
      </a>
      <div className="reservationProduct-item-content">
        <div className="item-content-header">
          <h5>{productData?.name}</h5>
          <div className="item-content-text">
            <p>
              {currentLanguage === "en" ? "Brand" : "Marka"}:{" "}
              <span>{productData?.marka}</span>
            </p>
            <p>
              {currentLanguage === "en" ? "Category" : "Kategoria"}:{" "}
              <span>{capitalize(productData?.category)}</span>
            </p>
            <p>
              {currentLanguage === "en" ? "Stock" : "Stoku"}:{" "}
              <span>
                {productData?.stock > 20
                  ? "20+"
                  : `${productData?.stock ?? 0} në stok`}
              </span>
            </p>
          </div>
        </div>
        <div className="reservationProduct-item-bottom">
          <h3>
            {productData?.salePrice || productData?.price}€/
            {currentLanguage === "en" ? "unit" : "copë"}
          </h3>
          <BlueButton
            productId={productData?.id}
            category={productData?.category}
            onClick={toggleModal}
          >
            Rezervo
          </BlueButton>
        </div>
      </div>
      <ReservationModal isOpen={isModalOpen} close={toggleModal}>
        {productData?.images[0]?.url && (
          <img
            src={productData?.images[0]?.url}
            alt=""
            className="productModalImage"
          />
        )}
        <div className="modal-details">
          <div className="reservationProduct-modal-top">
            <h5 className="modal-reservationProduct-title">
              {productData?.name}
            </h5>
            <div className="reservationProduct-modal-text">
              <p>
                Marka: <span>{capitalize(productData?.marka)}</span>
              </p>
              <p>
                Kategoria: <span>{capitalize(productData?.category)}</span>
              </p>
              <p>
                Stoku:{" "}
                <span>
                  {productData?.stock > 20
                    ? "20+"
                    : `${productData?.stock ?? 0} në stok`}
                </span>
              </p>
            </div>
          </div>
          <div className="reservationProduct-modal-bottom">
            <h3 className="modal-price">
              {productData?.salePrice || productData?.price}€/copë
            </h3>
            <div className="reservationProduct-box-counter">
              <p>Sasia: </p>
              <button onClick={handleDecrement}>-</button>
              <span>{quantity}</span>
              <button onClick={handleIncrement}>+</button>
            </div>
            <BlueButton
              productId={productData?.id}
              productData={productData}
              category={productData?.category}
              onClick={handleSubmit}
            >
              {currentLanguage === "en" ? "Preorder" : "Rezervo"}
            </BlueButton>
          </div>
        </div>
      </ReservationModal>
    </div>
  );
};

export default ResrevationProduct;
