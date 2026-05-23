import React, { useEffect, useMemo, useState } from "react";
import "./SingleAksesore.scss";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import OutlineButton from "../../../components/OutlineButton/OutlineButton";
import useFetchData, {
  getProData,
  getProDataById,
} from "../../../services/api";
import { useParams } from "react-router-dom";
import Loader from "../../../components/Loader";
import capitalize from "../../../utils/Capitalize";
import AddToCart from "../../../components/AddToCart/AddToCart";
import map from "../../../assets/images/map.png";
import noImage from "../../../assets/images/noImage.png";
import { useAuth } from "../../../context/AuthContext";
import ProductItemPRO from "../../../components/ProductItemPRO/ProductItemPRO";
import { useLanguage } from "../../../context/Language";
const SingleAksesore = () => {
  const { discount, priceHidden } = useAuth();
  const { currentLanguage } = useLanguage();

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>({});
  const [quantity, setQuanitity] = useState(4);
  const [activeImage, setActiveImage] = useState("");
  const { id: productId } = useParams();
  const filters = useMemo<Record<string, string[]>>(() => ({
    category: ["Aksesorë"],
  }), []);
  const { data: products } = useFetchData(getProData, 4, 1, filters);

  const fetchProduct = async () => {
    if (productId) {
      const res = await getProDataById(productId);
      setProduct(res);
      setActiveImage(res?.images?.[0] || noImage);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  };
  const discountedPrice = discount
    ? (product?.price - product?.price * (discount / 100))?.toFixed(2)
    : product?.price?.toFixed(2);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuanitity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuanitity(quantity + 1);
  };

  const handleImageClick = (imageUrl: string) => {
    setActiveImage(imageUrl);
  };

  const salePercentage =
    product?.price > 0 && discountedPrice
      ? Math.round(((product?.price - discountedPrice) / product?.price) * 100)
      : 0;
  const totalQuantity =
    product?.warehouses?.reduce(
      (sum: any, warehouse: any) => sum + (warehouse?.quantityAvailable ?? 0),
      0
    ) ?? 0;
  return (
    <div>
      <Loader isLoading={isLoading} />
      <Header />
      <div className="single-aksesor-wrapper">
        <div className="single-aksesor-details">
          <div className="product-left">
            <div className="product-images">
              <div className="main-image">
                <img src={activeImage || noImage} alt="accessory" />
                {salePercentage > 0 && (
                  <span className="sale">{salePercentage}%</span>
                )}
              </div>
              <div className="small-images">
                {product?.images?.map((imageUrl: string, index: number) => (
                  <div
                    className="small-image"
                    key={index}
                    onClick={() => handleImageClick(imageUrl)}
                  >
                    <img src={imageUrl} alt={`Product Image ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="product-details">
              <div className="product-title">
                <h5>{product?.description}</h5>
                <p>{product?.barcode}</p>
              </div>
              <div className="product-specs">
                <ul>
                  <li>
                    {currentLanguage === "en" ? "Category" : "Kategoria"}:{" "}
                    <span>{capitalize(product?.extra2)}</span>
                  </li>
                  <li>
                    {currentLanguage === "en" ? "Stock" : "Stok"}:{" "}
                   <span>
                        {totalQuantity > 20
                          ? "20+"
                          : `${totalQuantity} në stok`}
                      </span>
                  </li>
                </ul>
              </div>
              <div className="product-actions">
                <div className="product-prices">
                  {priceHidden ? (
                    <h3>••••€</h3>
                  ) : (
                    <>
                      <h5 className="strikethrough">
                        {product?.price === discountedPrice
                          ? `${product?.price?.toFixed(2)}€`
                          : null}
                      </h5>
                      <h3>{discountedPrice}€</h3>
                    </>
                  )}
                </div>
                <div className="product-box-counter">
                  <p>{currentLanguage === "en" ? "Quantity" : "Sasia"}: </p>

                  <button onClick={handleDecrement}>-</button>
                  <span>{quantity}</span>
                  <button  onClick={handleIncrement}>+</button>
                </div>
                <AddToCart
                  productData={product}
                  category={product?.extra2}
                  currentLanguage={currentLanguage}
                  quantity={quantity}
                />
              </div>
            </div>
          </div>
        </div>

       
        <div className="single-more-products">
          <div className="single-more-products-actions">
            <h2>
              {currentLanguage === "en" ? "Related products" : "Më të shiturat"}
            </h2>

            <a href="/aksesorë">
              <OutlineButton>
                {currentLanguage === "en"
                  ? "More Products"
                  : "Të gjitha produktet"}
              </OutlineButton>
            </a>
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="single-more-products-list">
              {products?.data?.slice(0, 4).map(
                (product: any, index: any) => (
                  <ProductItemPRO key={index} productData={product} />
                )
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SingleAksesore;
