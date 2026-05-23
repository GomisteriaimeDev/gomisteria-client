import "./ProductItemPRO.scss";
import capitalize from "../../utils/Capitalize";
import AddToCart from "../AddToCart/AddToCart";
import { useAuth } from "../../context/AuthContext";
import AddToWishlist from "../AddToWishlist/AddToWishlist";
import { useEffect, useState } from "react";
import noImage from "../../assets/images/noImage.png";
import { useLanguage } from "../../context/Language";
import BlueButton from "../BlueButton/BlueButton";
const ProductItemPRO = ({ productData }: any) => {
  const { currentLanguage } = useLanguage();
  const { discount, priceHidden } = useAuth();
  const [productImage, setProductImage] = useState<string>(noImage);
  const discountedPrice = discount
    ? (productData?.price - productData?.price * (discount / 100)).toFixed(2)
    : productData?.price.toFixed(2);

  const numericDiscountedPrice = discount
    ? productData?.price - productData?.price * (discount / 100)
    : productData?.price;
  const discountedPriceStr = numericDiscountedPrice?.toFixed(2);
  const extendedProductData = {
    ...productData,
    images: productData?.images?.[0] ? [productData.images[0]] : [],
    discountedPrice: numericDiscountedPrice, // numeric value
    discountedPriceStr: discountedPriceStr,
    productImage: productImage, // string value (if you prefer)
  };
  return (
    <div className="product-item">
      <a
        href={
          productData?.extra1 === "Fellne Teke"
            ? `/fellne/${productData?.code}`
            : `/${productData?.extra2?.toLowerCase()}/${productData?.code}`
        }
      >
        <img
          src={productData?.images[0] || noImage}
          alt=""
          className="product-image"
        />
      </a>
      <div className="product-item-content">
        {discount > 0 && <div className="discount-badge">-{discount}%</div>}
        <a
          href={
            productData?.extra1 === "Fellne Teke"
              ? `/fellne/${productData?.code}`
              : `/${productData?.extra2?.toLowerCase()}/${productData?.code}`
          }
        >
          <div className="item-content-header">
            <h5 title={productData?.description}>
              {productData?.description?.length > 40
                ? productData.description.slice(0, 40) + "..."
                : productData?.description}
            </h5>
            <div className="item-content-text">
              {productData?.extra2 === "Gomë" ? (
                <p>
                  {currentLanguage === "en" ? "Season" : "Sezona"}:{" "}
                  <span>{productData?.klasifikimi4}</span>
                </p>
              ) : null}
              {productData?.extra2 !== "Aksesorë" ? (
                <p>
                  {currentLanguage === "en" ? "Brand" : "Marka"}:{" "}
                  <span>{productData?.brand}</span>
                </p>
              ) : null}

              {productData?.extra2 === "Gomë" ? (
                <p>
                  Viti: <span>{productData?.klasifikimi3}</span>
                </p>
              ) : (
                <p>
                  {currentLanguage === "en" ? "Category" : "Kategoria"}:{" "}
                  <span>
                    {capitalize(productData?.extra1 || productData?.extra2)}
                  </span>
                </p>
              )}
              <p>
                {currentLanguage === "en" ? "Quantity" : "Sasia"}:{" "}
                <span>
                  {productData?.warehouses[0].quantityAvailable > 20
                    ? "20+"
                    : `${productData?.warehouses[0].quantityAvailable} në stok`}
                </span>
              </p>
            </div>
          </div>
        </a>

        <div className="product-item-bottom">
          <div className="product-prices-item">
            {priceHidden ? (
              <h3>••••€</h3>
            ) : (
              <>
                {discountedPrice === productData.price ? (
                  <h5 className="strikethrough">
                    {productData.price ? productData.price.toFixed(2) : null}€
                  </h5>
                ) : null}
                <h3>{discountedPriceStr}€</h3>
              </>
            )}
          </div>
          <div className="prodItemButtons">
            <a
              href={
                productData?.extra1 === "Fellne Teke"
                  ? `/fellne/${productData?.code}`
                  : `/${productData?.extra2?.toLowerCase()}/${productData?.code}`
              }
            >
              <BlueButton>
                {currentLanguage === "en" ? "View Product" : "Shiko Produktin"}
              </BlueButton>{" "}
            </a>
            <AddToWishlist productData={extendedProductData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItemPRO;
