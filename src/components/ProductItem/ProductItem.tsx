import "./ProductItem.scss";
import tire from "../../assets/images/guma.png";
import capitalize from "../../utils/Capitalize";
import AddToCart from "../AddToCart/AddToCart";
import { useAuth } from "../../context/AuthContext";
const ProductItem = ({ productData }: any) => {
  const { discount } = useAuth();
  return (
    <div className="product-item">
      <a
        href={`/${productData?.category?.toLowerCase()}/${
          productData?.Barcode
        }`}
      >
        <img
          src={productData?.images[0]?.url || tire}
          alt=""
          className="product-image"
        />
      </a>
      <div className="product-item-content">
      {discount && <div className="discount-badge">-{discount}%</div>}
        
        <a
          href={`/${productData?.category?.toLowerCase()}/${
            productData?.Barcode
          }`}
        >
          <div className="item-content-header">
            <h5>{productData?.name}</h5>
            <div className="item-content-text">
              <p>
                Marka: <span>{productData?.marka}</span>
              </p>
              <p>
                Kategoria: <span>{capitalize(productData?.category)}</span>
              </p>
            </div>
          </div>
        </a>
        <div className="product-item-bottom">
          <h3>
            {discount
              ? (
                  productData?.price -
                  productData?.price * (discount / 100)
                ).toFixed(2)
              : productData?.price.toFixed(2)}
            €/copë
          </h3>
          <AddToCart
            productData={productData}
            category={productData?.category}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
