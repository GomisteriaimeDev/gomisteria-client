import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import "./ReservationCheckout.scss";
import BlueButton from "../../components/BlueButton/BlueButton";
import { usePreorder } from "../../context/PreorderContext";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../services/axiosInstance";
import { useLanguage } from "../../context/Language";
import Footer from "../../components/Footer/Footer";
import ReservationItem from "../../components/Reservation/ReservationItem/ReservationItem";

const ReservationCheckout = () => {
  const { preorderCart } = usePreorder();
  const { currentLanguage } = useLanguage();
  const { discount, currentUser } = useAuth();
  const { id } = useParams();
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [submittingApi, setSubmittingApi] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const navigate = useNavigate();

  const t = (en: string, sq: string) => (currentLanguage === "en" ? en : sq);

  const getShippingFromCurrentUser = () => {
    const sf = currentUser?.specialFields ?? {};

    const isBusiness =
      currentUser?.role === "business" ||
      (sf.companyName && sf.companyName.trim().length > 0);

    const name = isBusiness ? sf.companyName ?? "" : sf.fullName ?? "";

    const country = sf.country ?? "";
    const city = sf.city ?? "";
    const address = sf.address ?? currentUser?.address ?? "";
    const phone = sf.phone;

    return {
      isBusiness,
      name,
      fullName: sf.fullName ?? "",
      companyName: sf.companyName ?? "",
      country,
      city,
      address,
      phone,
    };
  };

  // Calculate totals based on the preorder cart (membership discount only).
  useEffect(() => {
    const newSubtotal =
      preorderCart?.items?.reduce((acc: number, item: any) => {
        const price = item?.product?.salePrice || item?.product?.price || 0;
        return acc + price * (item?.quantity ?? 0);
      }, 0) || 0;

    setSubtotal(newSubtotal);
    setTotal(newSubtotal < 0 ? 0 : newSubtotal);
  }, [preorderCart, discount]);

  const initialValues = {
    paymentMethod: "cash" as "card" | "cash",
  };

  const validationSchema = Yup.object({
    paymentMethod: Yup.mixed<"card" | "cash">()
      .oneOf(["card", "cash"])
      .required(),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setSubmittingApi(true);
    const { name, country, city, address, phone } =
      getShippingFromCurrentUser();

    const shippingDetails = `${name}, ${country}, ${city}, ${address}, ${phone}`;

    const dataToSend: any = {
      ngarkesaId: id,
      userId: currentUser?.id,
      shippingDetails,
      fullName: name,
      country,
      total: total,
    };

    try {
      await axiosInstance.post("ngarkesa/preorder", dataToSend);
      setIsOrderPlaced(true);
      alert(
        t("Preorder submitted successfully!", "Paraporosia u dërgua me sukses!")
      );
      navigate("/reservation/success");
    } catch (error) {
      console.error("Failed to submit preorder:", error);
    } finally {
      setSubmitting(false);
      setSubmittingApi(false);
    }
  };

  return (
    <div>
      <Header />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting }: FormikProps<typeof initialValues>) => (
          <Form>
            <div className="checkout-wrapper">
              <div className="checkout-left">
                <div className="checkout-spaces">
                  {preorderCart?.items?.map((item: any) => (
                    <ReservationItem key={item.id} item={item} checkout />
                  ))}
                </div>
              </div>

              <div className="checkout-right">
                <h3>{t("Order Summary", "Përmbledhja e porosisë")}</h3>
                <div className="checkout-right-middle">
                  <div className="checkout-price-details">
                    <div className="checkout-price-details-item">
                      <p>Subtotal</p>
                      <span>{subtotal.toFixed(2)}€</span>
                    </div>
                  </div>
                  <div className="checkout-price-total">
                    <h6>Total</h6>
                    <span>{total.toFixed(2)}€</span>
                  </div>
                </div>

                <div className="checkout-right-buttons">
                  <BlueButton
                    type="submit"
                    disabled={isSubmitting || submittingApi || isOrderPlaced}
                  >
                    {isSubmitting || submittingApi || isOrderPlaced
                      ? "Loading..."
                      : t("Order Now", "Porosit")}
                  </BlueButton>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <Footer />
    </div>
  );
};

export default ReservationCheckout;
