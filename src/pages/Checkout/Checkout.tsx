import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import "./Checkout.scss";
import BlueButton from "../../components/BlueButton/BlueButton";
import { useCart } from "../../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../services/axiosInstance";
import Loader from "../../components/Loader";
import { useLanguage } from "../../context/Language";
import CartItem from "../../components/CartItem/CartItem";
import { countryData, cityData } from "../../data/locations";

const Checkout = () => {
  const { cart } = useCart();
  const { currentLanguage } = useLanguage();
  const { currentUser, discount } = useAuth();

  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [cities, setCities] = useState<string[]>([]);

  const [couponDetails, setCouponDetails] = useState<any>({});
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponAmount, setCouponAmount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const [couponType, setCouponType] = useState<"fixed" | "percentage" | null>(
    null
  );
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const navigate = useNavigate();

  const toNumber = (v: any, fallback = 0) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  const parsePhone = (raw?: string | null) => {
    if (!raw) {
      return { countryCode: "+383", phone: "" };
    }

    // Try to match "+383" + rest
    const match = raw.match(/^(\+\d{3})(\d+)$/);
    if (match) {
      return { countryCode: match[1], phone: match[2] };
    }

    // Fallbacks for other formats
    if (raw.startsWith("+")) {
      // naÃ¯ve split: first 4 chars as country code
      const countryCode = raw.slice(0, 4);
      const phone = raw.slice(4);
      return {
        countryCode: countryCode || "+383",
        phone,
      };
    }

    // No "+" â†’ treat all as local number
    return {
      countryCode: "+383",
      phone: raw,
    };
  };

  // -------------------------
  // Single source of truth for order shipping identity
  // -------------------------
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

  useEffect(() => {
    const userCountry = currentUser?.specialFields?.country;
    if (userCountry) {
      setCities(cityData[userCountry] || []);
    }
  }, [currentUser?.specialFields?.country]);

  const removeCoupon = () => {
    setCouponCode("");
    setCouponDetails({});
    setCouponDiscount(0);
    setCouponAmount(0);
    setCouponType(null);
    setCouponError("");
    setIsCouponApplied(false); // âœ… re-enables user discount
  };

  const applyCoupon = async () => {
    if (!couponCode) {
      setCouponError(
        currentLanguage === "en"
          ? "Please enter a coupon code"
          : "Ju lutem shkruani kodin"
      );
      return;
    }

    setCouponLoading(true);
    try {
      const response = await axiosInstance.get(`/coupons/${couponCode}`);
      const coupon = response.data;

      if (coupon.usedCount >= coupon.maxRedemptions) {
        setCouponError(
          currentLanguage === "en"
            ? "This coupon is no longer valid"
            : "Ky kupon nuk është më i vlefshëm"
        );
        setCouponDiscount(0);
        setCouponType(null);
        setIsCouponApplied(false);
        return;
      }

      setCouponDetails(coupon);
      setCouponType(coupon.type);
      setCouponDiscount(coupon.value);
      setCouponError("");
      setIsCouponApplied(true);
    } catch {
      setCouponError(
        currentLanguage === "en"
          ? "Coupon is invalid"
          : "Kuponi është i pavlefshëm"
      );
      setCouponDiscount(0);
      setCouponType(null);
      setIsCouponApplied(false);
    } finally {
      setCouponLoading(false);
    }
  };

  const initialValues = {
    fullName:
      currentUser?.specialFields?.fullName ||
      currentUser?.specialFields?.companyName ||
      "",
    country: currentUser?.specialFields?.country || "",
    city: currentUser?.specialFields?.city || "",
    address: currentUser?.specialFields?.address || currentUser?.address || "",
    phone: parsePhone(currentUser?.specialFields?.phone),
    paymentMethod: "cash" as "cash" | "card",
    fullNamePayment: "",
    cardNumber: "",
    cardDate: "",
    cardCVV: "",
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required(
      currentLanguage === "en"
        ? "Please provide your full name."
        : "Ju lutem shkruani emrin e plotë."
    ),
    country: Yup.string().required(
      currentLanguage === "en"
        ? "Please select a country."
        : "Ju lutem zgjidhni shtetin."
    ),
    city: Yup.string().required(
      currentLanguage === "en"
        ? "Please select a city."
        : "Ju lutem zgjidhni qytetin."
    ),
    address: Yup.string().required(
      currentLanguage === "en"
        ? "Please provide your address."
        : "Ju lutem shkruani adresën."
    ),
    phone: Yup.object({
      phone: Yup.string()
        .matches(
          /^\d+$/,
          currentLanguage === "en"
            ? "Phone number is not valid"
            : "Numri i telefonit nuk është i saktë"
        )
        .required(
          currentLanguage === "en"
            ? "Please provide a phone number."
            : "Ju lutem shkruani numrin e telefonit."
        ),
      countryCode: Yup.string().required(
        currentLanguage === "en"
          ? "Please select a country code."
          : "Ju lutem zgjidhni kodin e shtetit."
      ),
    }).required(),
    paymentMethod: Yup.mixed<"card" | "cash">()
      .oneOf(["card", "cash"])
      .required(),
    fullNamePayment: Yup.string().when("paymentMethod", {
      is: "card",
      then: (schema) =>
        schema.required(
          currentLanguage === "en"
            ? "Please provide the name on the card."
            : "Shkruani emrin në kartelë."
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    cardNumber: Yup.string().when("paymentMethod", {
      is: "card",
      then: (schema) =>
        schema
          .matches(
            /^\d{16}$/,
            currentLanguage === "en"
              ? "Card number is not valid"
              : "Numri i kartelës nuk është i saktë"
          )
          .required(
            currentLanguage === "en"
              ? "Please provide a card number."
              : "Shkruani numrin e kartelës."
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    cardDate: Yup.string().when("paymentMethod", {
      is: "card",
      then: (schema) =>
        schema
          .matches(
            /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/,
            currentLanguage === "en"
              ? "Date is not valid"
              : "Data nuk është e saktë"
          )
          .required(
            currentLanguage === "en"
              ? "Please provide the card expiration date."
              : "Shkruani datën e skadimit."
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    cardCVV: Yup.string().when("paymentMethod", {
      is: "card",
      then: (schema) =>
        schema
          .matches(
            /^\d{3}$/,
            currentLanguage === "en" ? "CVV is not valid" : "CVV nuk është i saktë"
          )
          .required(
            currentLanguage === "en" ? "Please provide the card CVV." : "Shkruani CVV."
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  useEffect(() => {
    const shouldUseUserDiscount = !isCouponApplied;

    const newSubtotal =
      cart?.items?.reduce((acc, item) => {
        const basePrice = toNumber(item?.productData?.price, 0);
        const qty = toNumber(item?.quantity, 0);

        const unitPrice =
          shouldUseUserDiscount && toNumber(discount, 0) > 0
            ? basePrice - basePrice * (toNumber(discount, 0) / 100)
            : basePrice;

        return acc + unitPrice * qty;
      }, 0) ?? 0;

    const safeSubtotal = toNumber(newSubtotal, 0);
    setSubtotal(safeSubtotal);

    let discountAmount = 0;
    const safeCouponDiscount = toNumber(couponDiscount, 0);

    if (isCouponApplied && couponType === "percentage") {
      discountAmount = safeSubtotal * (safeCouponDiscount / 100);
    } else if (isCouponApplied && couponType === "fixed") {
      discountAmount = safeCouponDiscount;
    }

    discountAmount = Math.min(toNumber(discountAmount, 0), safeSubtotal);
    setCouponAmount(discountAmount);

    const newTotal = safeSubtotal - discountAmount;
    setTotal(Number.isFinite(newTotal) && newTotal > 0 ? newTotal : 0);
  }, [cart, couponDiscount, couponType, discount, isCouponApplied]);

  const handleSubmit = async (
    values: any,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const { isBusiness, name, fullName, companyName, country, city, address, phone } =
      getShippingFromCurrentUser();

    const shippingDetails = `${name}, ${country}, ${city}, ${address}, ${phone}`;
    const notes = localStorage.getItem("cartNotes");

    const dataToSend = {
      cartId: cart.id,
      shippingDetails,

      discount: isCouponApplied ? 0 : discount,
      couponId: isCouponApplied ? couponDetails.id : null,

      customerType: isBusiness ? "business" : "client",
      fullName: isBusiness ? null : fullName,
      companyName: isBusiness ? companyName : null,

      country,
      city,
      address,
      phone: phone,

      notes: notes,
      total: total,
      paymentMethod: values.paymentMethod,

      ...(values.paymentMethod === "card"
        ? {
            fullNamePayment: values.fullNamePayment,
            cardLast4: values.cardNumber?.slice(-4) ?? "",
          }
        : {}),
    };

    try {
      if (isCouponApplied && couponCode && couponType) {
        await axiosInstance.patch(`/coupons/${couponCode}`, {
          usedCount: (couponDetails.usedCount ?? 0) + 1,
        });
      }

      await axios.post("https://gomisteria-api.onrender.com/api/orders", dataToSend);

      setIsOrderPlaced(true);
      navigate("/cart/success");
      localStorage.removeItem("cartNotes");
    } catch (error) {
      console.error("Failed to submit form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCountryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    const selectedCountry = event.target.value;
    setFieldValue("country", selectedCountry);
    setCities(cityData[selectedCountry] || []);
    setFieldValue("city", "");
  };

  const hasUserDiscount = toNumber(discount, 0) > 0;

  return (
    <div>
      <Header />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({
          setFieldValue,
          values,
          errors,
          touched,
          isSubmitting,
          submitCount,
        }: FormikProps<typeof initialValues>) => {
          const anyTouched = (obj: any): boolean =>
            !!obj &&
            (Object.values(obj).some((v: any) => v === true) ||
              Object.values(obj).some(
                (v: any) => typeof v === "object" && anyTouched(v)
              ));

          const collectMessages = (
            errObj: any,
            touchObj: any,
            includeUntouched: boolean
          ): string[] => {
            if (!errObj) return [];
            const msgs: string[] = [];
            for (const [key, val] of Object.entries(errObj)) {
              const t = touchObj ? (touchObj as any)[key] : undefined;
              if (typeof val === "string") {
                if (includeUntouched || t === true) msgs.push(val);
              } else if (typeof val === "object" && val) {
                msgs.push(...collectMessages(val, t, includeUntouched));
              }
            }
            return msgs;
          };

          const shouldShowSummary = submitCount > 0 || anyTouched(touched);
          const summaryMessages = collectMessages(
            errors,
            touched,
            submitCount > 0
          );

          return (
            <Form>
              <div className="checkout-wrapper">
                <div className="checkout-left">
                  <div className="checkout-spaces">
                    {cart?.items?.map((item: any) => (
                      <CartItem key={item.id} item={item} checkout={true} />
                    ))}
                  </div>
                </div>

                <div className="checkout-right">
                  <h3>
                    {currentLanguage === "en"
                      ? "Order Summary"
                      : "Përmbledhja e porosisë"}
                  </h3>

                  <div className="checkout-right-middle">
                    <div className="checkout-price-details">
                      <div className="checkout-price-details-item">
                        <p>Subtotal</p>
                        <span>{subtotal.toFixed(2)}€</span>
                      </div>

                      <div className="checkout-price-details-item">
                        <div>
                          <p style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {currentLanguage === "en"
                              ? "Code discount"
                              : "Zbritje nga kodi"}
                            {couponType === "percentage" && couponDiscount > 0
                              ? ` (${couponDiscount}%)`
                              : couponType === "fixed" && couponDiscount > 0
                              ? ` (${couponDiscount.toFixed(2)}€)`
                              : ""}
                            :

                            {isCouponApplied && (
                              <span
                                onClick={removeCoupon}
                                title={
                                  currentLanguage === "en"
                                    ? "Remove coupon"
                                    : "Hiq kuponin"
                                }
                                style={{
                                  marginLeft: 6,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: 16,
                                  height: 16,
                                  borderRadius: 999,
                                  border: "1px solid #d9d9d9",
                                  color: "#7b7b7b",
                                  fontSize: 12,
                                  lineHeight: "12px",
                                  cursor: "pointer",
                                  userSelect: "none",
                                }}
                              >
                                Ã—
                              </span>
                            )}
                          </p>

                          {isCouponApplied && hasUserDiscount && (
                            <p
                              style={{
                                marginTop: 6,
                                fontSize: 12,
                                lineHeight: "16px",
                                color: "#7b7b7b",
                              }}
                            >
                              {currentLanguage === "en"
                                ? `Note: Your ${toNumber(discount, 0)}% customer discount is annulled when using a coupon code.`
                                : `Shënim: Zbritja juaj e klientit ${toNumber(discount, 0)}% anulohet kur përdoret kodi i kuponit.`}
                            </p>
                          )}
                        </div>

                        <span>-{couponAmount.toFixed(2)}€</span>
                      </div>
                    </div>

                    <div className="checkout-price-total">
                      <h6>Total</h6>
                      <span>{total.toFixed(2)}€</span>
                    </div>

                    <div className="cuponInputs">
                      <input
                        name="coupon"
                        placeholder={
                          currentLanguage === "en"
                            ? "Enter Coupon Code"
                            : "Shkruani kodin e kuponit të zbritjes"
                        }
                        type="search"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setIsCouponApplied(false);
                        }}
                      />

                      <div className="apply-coupon-button">
                        <BlueButton
                          type="button"
                          disabled={couponLoading}
                          onClick={applyCoupon}
                        >
                          {couponLoading ? (
                            <Loader />
                          ) : currentLanguage === "en" ? (
                            "Apply"
                          ) : (
                            "Apliko"
                          )}
                        </BlueButton>
                      </div>
                    </div>

                    {couponError && <div className="coupon-error">{couponError}</div>}
                  </div>

                  {shouldShowSummary && summaryMessages.length > 0 && (
                    <div className="checkout-errors-summary">
                      <ul>
                        {summaryMessages.map((msg, i) => (
                          <li key={i}>{msg}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="checkout-right-buttons">
                    <BlueButton type="submit" disabled={isSubmitting || isOrderPlaced}>
                      {isSubmitting || isOrderPlaced
                        ? "Loading..."
                        : currentLanguage === "en"
                        ? "Order Now"
                        : "Porosit"}
                    </BlueButton>
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Checkout;







