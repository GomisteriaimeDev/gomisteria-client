import React, { useEffect, useState } from "react";
import "./Single.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import map from "../../assets/images/map.png";
import OutlineButton from "../../components/OutlineButton/OutlineButton";
import ProductItem from "../../components/ProductItem/ProductItem";
import useFetchData, {
  getProDataById,
  getProductsByCategory,
} from "../../services/api";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import capitalize from "../../utils/Capitalize";
import AddToCart from "../../components/AddToCart/AddToCart";
import tire from "../../assets/images/guma.png";
import { useAuth } from "../../context/AuthContext";

const Single = () => {
    const { discount } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>({});
  const [quantity, setQuanitity] = useState(4);
  const [activeImage, setActiveImage] = useState("");
  const [images, setImages] = useState<string[]>([]); // Store all fetched images
  const { id: productId } = useParams();
  const { data: products, isLoading: isLoadingRelated } = useFetchData(
    getProductsByCategory,
    "goma",
    1,
    6
  );
  const discountedPrice = discount
    ? (
      product?.price -
        product?.price * (discount / 100)
      ).toFixed(2)
    : product?.price?.toFixed(2);

  const fetchProduct = async () => {
    if (productId) {
      const res = await getProDataById(productId.toString());
      setProduct(res?.GetStoqetperItemIDResult[0]);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  };

  const fetchImages = async (barcode: string) => {
    const fetchedImages: string[] = [];
    for (let i = 1; i <= 1; i++) {
      try {
        const response = await fetch(
          `https://gomisteria-api.onrender.com/api/prodata/image/${barcode}/${i}`,
          {
            method: "GET",
            headers: {
              Accept: "image/jpeg",
            },
          }
        );
        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          fetchedImages.push(imageUrl);
        }
      } catch (error) {
        console.error(`Error fetching image ${i}:`, error);
        break; // Stop fetching further images if an error occurs
      }
    }
    setImages(fetchedImages);
    setActiveImage(fetchedImages[0] || tire); // Set the first image as active
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (product?.Barcode) {
      fetchImages(product.Barcode);
    }
  }, [product?.Barcode]);

  const handleDecrement = () => {
    if (quantity > 4) {
      setQuanitity(quantity - 4);
    }
  };

  const handleIncrement = () => {
    setQuanitity(quantity + 4);
  };

  const handleImageClick = (imageUrl: string) => {
    setActiveImage(imageUrl);
  };

  const salePercentage =
    product.price > 0 && product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <div>
      <Loader isLoading={isLoading} />
      <Header />
      <div className="single-goma-wrapper">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="single-goma-details">
            <div className="product-left">
              <div className="product-images">
                <div className="main-image">
                  <img src={activeImage || tire} alt="tyre" />
                  {salePercentage > 0 && (
                    <span className="sale">{salePercentage}%</span>
                  )}
                </div>
                <div className="small-images">
                  {images.map((imageUrl, index) => (
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
                  <p>Gomisteria</p>
                </div>
                <div className="product-specs">
                  <ul>
                    <li>
                      Marka: <span>{product?.Brand}</span>
                    </li>
                    <li>
                      Kategoria:
                      <span>{capitalize(product?.Clasification3)}</span>
                    </li>
                    <li>
                      Sezona: <span>{product?.Clasification4}</span>
                    </li>
                    <li>
                      Indeksi i ngaerkesës:
                      <span>{product?.details?.indeksiNgarkeses}</span>
                    </li>
                    <li>
                      Indeksi i shpejtësisë:
                      <span>{product?.details?.indeksiShpejtesise}</span>
                    </li>
                  </ul>
                </div>
                <div className="product-actions">
                  <div className="product-prices">
                    <h5 className="strikethrough">
                      {product?.price
                        ? product?.price.toFixed(2)
                        : null}
                      €
                    </h5>
                    <h3>
                      {product.price
                        ? product?.price.toFixed(2)
                        : product?.price.toFixed(2)}
                      €
                    </h3>
                  </div>
                  <div className="product-box-counter">
                    <p>Sasia: </p>
                    <button onClick={handleDecrement}>-</button>
                    <span>{quantity}</span>
                    <button onClick={handleIncrement}>+</button>
                  </div>
                  <AddToCart
                    productData={product}
                    category={product?.category}
                    quantity={quantity}
                  />
                </div>
              </div>
            </div>

            <div className="product-goma-description">
              <div className="product-goma-description-item">
                <h6>Konsumi i karburantit</h6>
                <p>{product?.details?.konsumiKarburantit}</p>
              </div>
              <div className="product-goma-description-item">
                <h6>Në terrene të vështira:</h6>
                <p>{product?.details?.terrenVeshtire}</p>
              </div>
              <div className="product-goma-description-item">
                <h6>Niveli i zhurmës</h6>
                <p>{product?.details?.zhurma}</p>
              </div>
            </div>
          </div>
        )}

        <div className="single-page-map">
          <h5>Gjeni dyqanin më të afërt</h5>
          <img src={map} alt="map" />
        </div>
        <div className="single-more-products">
          <div className="single-more-products-actions">
            <h2>Më të shiturat</h2>
            <a href="/goma">
              <OutlineButton>Të gjitha produktet</OutlineButton>
            </a>
          </div>
          {isLoadingRelated ? (
            <Loader />
          ) : (
            <div className="single-more-products-list">
              {products.data.map((product: any) => (
                <ProductItem key={product.id} productData={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Single;
