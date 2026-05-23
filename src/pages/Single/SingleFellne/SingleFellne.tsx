import { useEffect, useMemo, useState } from "react";
import "./SingleFellne.scss";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import map from "../../../assets/images/map.png";
import OutlineButton from "../../../components/OutlineButton/OutlineButton";
import { useParams } from "react-router-dom";
import Loader from "../../../components/Loader";
import { useAuth } from "../../../context/AuthContext";
import useFetchData, { getProData, getProDataById } from "../../../services/api";
import AddToCart from "../../../components/AddToCart/AddToCart";
import capitalize from "../../../utils/Capitalize";
import noImage from "../../../assets/images/noImage.png";
import ProductItemPRO from "../../../components/ProductItemPRO/ProductItemPRO";
import { useLanguage } from "../../../context/Language";

const SingleFellne = () => {
  const { discount, priceHidden } = useAuth();
  const { currentLanguage } = useLanguage();

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>({});
  const [quantity, setQuanitity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const { id: productId } = useParams();

  const filters = useMemo<Record<string, string[]>>(() => ({
    category: ["fellne"],
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

  // Total stock across warehouses
  const totalQuantity = useMemo(() => {
    return (
      product?.warehouses?.reduce(
        (sum: number, w: any) => sum + (w?.quantityAvailable ?? 0),
        0
      ) ?? 0
    );
  }, [product?.warehouses]);

  // Fellne step rules: sell by 1 OR by 4
  const step = product?.extra1 ? 1 : 4; // keep your existing rule
  const minQuantity = step;

  // Max quantity respecting step and stock
  const maxQuantity = useMemo(() => {
    if (totalQuantity <= 0) return 0;
    if (step === 1) return totalQuantity;
    return Math.floor(totalQuantity / step) * step; // largest multiple of 4 <= stock
  }, [totalQuantity, step]);

  // Keep quantity valid whenever stock/step changes
  useEffect(() => {
    if (totalQuantity <= 0 || maxQuantity <= 0) {
      setQuanitity(0);
      return;
    }

    setQuanitity((q) => {
      // enforce minimum (1 or 4)
      if (q < minQuantity) return minQuantity;

      // clamp to max
      if (q > maxQuantity) return maxQuantity;

      // if selling by 4, keep quantity aligned to multiples of 4
      if (step > 1) {
        const aligned = Math.round(q / step) * step;
        if (aligned < minQuantity) return minQuantity;
        if (aligned > maxQuantity) return maxQuantity;
        return aligned;
      }

      return q;
    });
  }, [totalQuantity, minQuantity, maxQuantity, step]);

  const handleDecrement = () => {
    if (quantity > minQuantity) setQuanitity(quantity - step);
  };

  const handleIncrement = () => {
    if (quantity + step <= maxQuantity) setQuanitity(quantity + step);
  };

  const canDecrement = quantity > minQuantity;
  const canIncrement = quantity + step <= maxQuantity;

  const handleImageClick = (imageUrl: string) => {
    setActiveImage(imageUrl);
  };

  // Sale percentage based on discount (matches your tyre page logic)
  const salePercentage =
    product?.price > 0 && discountedPrice
      ? Math.round(
          ((product?.price - Number(discountedPrice)) / product?.price) * 100
        )
      : 0;

  return (
    <div>
      <Loader isLoading={isLoading} />
      <Header />

      <div className="single-fellne-wrapper">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="single-fellne-details">
            <div className="product-left">
              <div className="product-images">
                <div className="main-image">
                  <img src={activeImage || noImage} alt="tyre" />

                  {salePercentage > 0 && (
                    <span className="sale">{salePercentage}%</span>
                  )}
                </div>

                <div className="small-images">
                  {product?.images?.map((imageUrl: any, index: any) => (
                    <div
                      className="small-image"
                      key={index}
                      onClick={() => handleImageClick(imageUrl)}
                    >
                      <img src={imageUrl} alt={`Product ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="product-details">
                <div className="product-title">
                  <h5>{product?.description}</h5>
                  <p>{product?.code}</p>
                </div>

                <div className="product-specs-fellne">
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
                      {currentLanguage === "en" ? "Color" : "Ngjura"}:{" "}
                      <span>{product?.klasifikimi4}</span>
                    </li>
                    <li>
                      {currentLanguage === "en" ? "Vehicle" : "Vetura"}:{" "}
                      <span>{product?.klasifikimi1}</span>
                    </li>
                    <li>
                      {currentLanguage === "en" ? "Vrimat" : "Vrimat"}:{" "}
                      <span>{product?.klasifikimi3}</span>
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
        )}

       

        <div className="single-more-products">
          <div className="single-more-products-actions">
            <h2>
              {currentLanguage === "en" ? "Related products" : "Më të shiturat"}
            </h2>

            <a href="/fellne">
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
              {products?.data?.slice(0, 4).map((p: any, index: any) => (
                <ProductItemPRO key={index} productData={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SingleFellne;
