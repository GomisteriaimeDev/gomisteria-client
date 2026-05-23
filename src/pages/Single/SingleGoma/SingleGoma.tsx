import { useEffect, useMemo, useState } from "react";
import "./SingleGoma.scss";
import map from "../../../assets/images/map.png";

import { useParams } from "react-router-dom";
import useFetchData, { getProData, getProDataById } from "../../../services/api";
import Loader from "../../../components/Loader";
import Header from "../../../components/Header/Header";
import capitalize from "../../../utils/Capitalize";
import AddToCart from "../../../components/AddToCart/AddToCart";
import OutlineButton from "../../../components/OutlineButton/OutlineButton";
import Footer from "../../../components/Footer/Footer";
import { useAuth } from "../../../context/AuthContext";
import noImage from "../../../assets/images/noImage.png";
import ProductItemPRO from "../../../components/ProductItemPRO/ProductItemPRO";
import { useLanguage } from "../../../context/Language";

const Single = () => {
  const { discount, priceHidden } = useAuth();
  const { currentLanguage } = useLanguage();

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>({});
  const [quantity, setQuanitity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const { id: productId } = useParams();

  const filters = useMemo<Record<string, string[]>>(() => ({
    category: ["gomë"],
  }), []);

  const { data: products } = useFetchData(getProData, 4, 1, filters);

  const fetchProduct = async () => {
    if (!productId) {
      setIsLoading(true);
      return;
    }

    const res = await getProDataById(productId);
    setProduct(res);
    setActiveImage(res?.images?.[0] || noImage);
    setIsLoading(false);

    // reset quantity for a newly loaded product
    setQuanitity(1);
  };

  useEffect(() => {
    if (productId) fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const discountedPrice = discount
    ? (product?.price - product?.price * (discount / 100))?.toFixed(2)
    : product?.price?.toFixed(2);

  const totalQuantity = useMemo(() => {
    return (
      product?.warehouses?.reduce(
        (sum: number, w: any) => sum + (w?.quantityAvailable ?? 0),
        0
      ) ?? 0
    );
  }, [product?.warehouses]);

  // Keep quantity valid whenever stock changes
  useEffect(() => {
    // Out of stock => quantity 0 (and you can disable AddToCart if supported)
    if (totalQuantity <= 0) {
      setQuanitity(0);
      return;
    }

    // Clamp between 1 and totalQuantity
    setQuanitity((q) => {
      if (q < 1) return 1;
      if (q > totalQuantity) return totalQuantity;
      return q;
    });
  }, [totalQuantity]);

  const handleDecrement = () => {
    if (quantity > 1) setQuanitity(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < totalQuantity) setQuanitity(quantity + 1);
  };

  const canDecrement = quantity > 1;
  const canIncrement = quantity < totalQuantity;

  const handleImageClick = (imageUrl: string) => {
    setActiveImage(imageUrl);
  };

  const salePercentage =
    product?.price > 0 && discountedPrice
      ? Math.round(((product?.price - Number(discountedPrice)) / product?.price) * 100)
      : 0;

  return (
    <div>
      <Loader isLoading={isLoading} />
      <Header />

      <div className="single-goma-wrapper">
        <div className="single-goma-details">
          <div className="product-left">
            <div className="product-images">
              <div className="main-image">
                <img src={activeImage || noImage} alt="product" />
                {salePercentage > 0 && <span className="sale">{salePercentage}%</span>}
              </div>

              <div className="small-images">
                {product?.images?.map((img: any, index: any) => (
                  <div
                    className="small-image"
                    key={index}
                    onClick={() => handleImageClick(img)}
                  >
                    <img src={img} alt={`Product ${index + 1}`} />
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
                    {currentLanguage === "en" ? "Brand" : "Marka"}:{" "}
                    <span>{product?.brand}</span>
                  </li>
                  <li>
                    {currentLanguage === "en" ? "Category" : "Kategoria"}:{" "}
                    <span>{capitalize(product?.extra2)}</span>
                  </li>
                  <li>
                    {currentLanguage === "en" ? "Seson" : "Sezona"}:{" "}
                    <span>{product?.klasifikimi4}</span>
                  </li>
                  <li>
                    Viti: <span>{product?.klasifikimi3}</span>
                  </li>
                  <li>
                    {currentLanguage === "en" ? "Stock" : "Stok"}:{" "}
                    <span>
                      {totalQuantity > 20 ? "20+" : `${totalQuantity} në stok`}
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
                        {discount > 0 ? `${product?.price?.toFixed(2)}€` : null}
                      </h5>
                      <h3>{discountedPrice}€</h3>
                    </>
                  )}
                </div>

                <div className="product-box-counter">
                  <p>{currentLanguage === "en" ? "Quantity" : "Sasia"}: </p>

                  <button
                    onClick={handleDecrement}
                    disabled={!canDecrement || isLoading || quantity === 0}
                  >
                    -
                  </button>

                  <span>{quantity}</span>

                  <button
                    onClick={handleIncrement}
                    disabled={!canIncrement || isLoading || quantity === 0}
                  >
                    +
                  </button>
                </div>

                <AddToCart
                  productData={product}
                  category={product?.extra2}
                  quantity={quantity}
                  currentLanguage={currentLanguage}
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
            <a href="/goma">
              <OutlineButton>
                {currentLanguage === "en" ? "More Products" : "Të gjitha produktet"}
              </OutlineButton>
            </a>
          </div>

          {/* {isLoading ? (
            <Loader />
          ) : (
            <div className="single-more-products-list">
              {products?.data?.slice(0, 4).map((p: any, index: any) => (
                <ProductItemPRO key={index} productData={p} />
              ))}
            </div>
          )} */}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Single;
