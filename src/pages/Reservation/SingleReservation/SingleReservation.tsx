import "./SingleReservation.scss";
import { useParams } from "react-router-dom";
import useFetchData, { getNgarkesaById } from "../../../services/api";
import Header from "../../../components/Header/Header";

import Footer from "../../../components/Footer/Footer";
import ResrevationProduct from "../../../components/Reservation/ResrevationProduct/ResrevationProduct";
import shoppingBag from "../../../assets/svg/shoppingBag.svg";
import { usePreorder } from "../../../context/PreorderContext";
const SingleReservation = () => {
  const { id } = useParams();
  const { preorderCartCount } = usePreorder();
  const { data, isLoading, error } = useFetchData(
    getNgarkesaById,
    id
  );

  if (error) return <p>Error loading products: {error.message}</p>;

  return (
    <>
      <Header />
      <div className="reservationProductsWrapper">
        <div className="reservation-cart-icon">
          <h5>Shport juaj: </h5>
          <a href={`/reservation/cart/${id}`} className="reservation-cart-icon-wrapper">
            <img src={shoppingBag} alt="" className="reservation-shoppingBag" />
            {preorderCartCount > 0 && (
              <span className="reservation-cart-count-indicator">
                {preorderCartCount}
              </span>
            )}
          </a>
        </div>
        <div className="searchProducts">
          <div className="searchProductsListCenter">
            {data?.products?.map((product: any, index: any) => (
              <ResrevationProduct
                key={index}
                productData={product}
                productNgarkesaId={product.id}
                ngarkesaId={id}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SingleReservation;
