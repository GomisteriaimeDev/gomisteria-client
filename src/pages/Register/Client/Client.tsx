import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./Client.scss";
import logo from "../../../assets/svg/Logo.svg";
import FormWrapper from "../../../components/Form/Form";
import FormInput from "../../../components/FormInput/FormInput";
import BlueButton from "../../../components/BlueButton/BlueButton";
import CustomSelect from "../../../components/FormSelect/FormSelect";
import PhoneNumberInput from "../../../components/PhoneNumberInput/PhoneNumberInput";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/Language";
import { countryData, cityData } from "../../../data/locations";

interface Phone {
  phone: string;
  countryCode: string;
}

interface ClientFormValues {
  fullName: string;
  email: string;
  country: string;
  city: string;
  address: string;
  password: string;
  phone: Phone;
}

type BackendErrorData = {
  code?: string;
  message?: string | string[];
  errors?: Record<string, string>;
};

const initialValues: ClientFormValues = {
  fullName: "",
  email: "",
  country: "",
  city: "",
  address: "",
  password: "",
  phone: { phone: "", countryCode: "+383" },
};

const Client: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const toggleLanguage = () => setLanguage(currentLanguage === "sq" ? "en" : "sq");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validationSchema = Yup.object({
    fullName: Yup.string().required(
      currentLanguage === "en" ? "Please provide the required field." : "Ju lutem plotësoni fushën e kërkuar."
    ),
    email: Yup.string()
      .email(currentLanguage === "en" ? "Invalid email address" : "Email i pavlefshëm")
      .required(currentLanguage === "en" ? "Please provide the required field." : "Ju lutem plotësoni fushën e kërkuar."),
    country: Yup.string().required(
      currentLanguage === "en" ? "Please provide the required field." : "Ju lutem plotësoni fushën e kërkuar."
    ),
    city: Yup.string().required(
      currentLanguage === "en" ? "Please provide the required field." : "Ju lutem plotësoni fushën e kërkuar."
    ),
    address: Yup.string().required(
      currentLanguage === "en" ? "Please provide the required field." : "Ju lutem plotësoni fushën e kërkuar."
    ),
    password: Yup.string().required(
      currentLanguage === "en" ? "Please provide a password." : "Ju lutem vendosni një fjalëkalim."
    ),
    phone: Yup.object({
      phone: Yup.string()
        .matches(/^\d+$/, currentLanguage === "en" ? "Phone number is not valid" : "Numri i telefonit nuk është i vlefshëm")
        .required(currentLanguage === "en" ? "Please provide the required field." : "Ju lutem plotësoni fushën e kërkuar."),
      countryCode: Yup.string().required(
        currentLanguage === "en" ? "Please provide the required field." : "Ju lutem plotësoni fushën e kërkuar."
      ),
    }).required(
      currentLanguage === "en" ? "Please provide the required field." : "Ju lutem plotësoni fushën e kërkuar."
    ),
  });

  const handleCountryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    const selectedCountry = event.target.value;
    setFieldValue("country", selectedCountry);
    setCities(cityData[selectedCountry] || []);
    setFieldValue("city", "");
  };

  const messageForRegisterCode = (code?: string, backendMessage?: string | string[]) => {
    if (code === "AUTH_EMAIL_IN_USE") {
      return currentLanguage === "en"
        ? "Email already in use."
        : "Ky email është në përdorim.";
    }
    if (backendMessage && typeof backendMessage === "string") {
      return backendMessage;
    }
    return currentLanguage === "en"
      ? "Registration failed. Please try again later."
      : "Regjistrimi dështoi. Ju lutemi provoni më vonë.";
  };

  const handleClient = async (
    values: ClientFormValues,
    {
      setSubmitting,
      setErrors,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      setErrors: (errors: Record<string, string>) => void;
    }
  ) => {
    setGeneralError(null);
    setLoading(true);

    const { fullName, email, address, password, country, city, phone, ...rest } = values;

    const dataToSend = {
      email,
      password,
      specialFields: {
        fullName,
        address,
        country,
        city,
        phone: `${phone.countryCode}${phone.phone}`,
        ...rest,
      },
    };

    try {
      const response = await axios.post(
        "https://gomisteria-api.onrender.com/api/users/registerClient",
        dataToSend
      );

      setSubmitting(false);
      setLoading(false);

      navigate(`/verify-phone/${response.data.id}`, {
        state: { phone: `${phone.countryCode}${phone.phone}` },
      });
    } catch (err: any) {
      const status = err?.response?.status;
      const data: BackendErrorData | undefined = err?.response?.data;

      // If backend returns field-level errors:
      // { errors: { email: "...", password: "..." } }
      if (status === 400 && data?.errors) {
        setErrors(data.errors);
        setSubmitting(false);
        setLoading(false);
        return;
      }

      // Email already in use, etc.
      if (status === 409) {
        const msg = messageForRegisterCode(data?.code, data?.message);
        setErrors({ email: msg });
        setGeneralError(msg);
        setSubmitting(false);
        setLoading(false);
        return;
      }

      // Other handled backend errors
      if (status === 400 || status === 401) {
        setGeneralError(messageForRegisterCode(data?.code, data?.message));
        setSubmitting(false);
        setLoading(false);
        return;
      }

      setGeneralError(messageForRegisterCode(undefined));
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="clientWrapper">
      <button onClick={toggleLanguage} className="languageToggle-auth">
        {currentLanguage === "en" ? (
          <img src="https://flagcdn.com/w40/gb.png" alt="English" />
        ) : (
          <img src="https://flagcdn.com/w40/al.png" alt="Shqip" />
        )}
      </button>

      <img src={logo} alt="gomisteriaLogo" className="intro-logo" />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleClient}
      >
        {({ isSubmitting, setFieldValue, values, errors, touched }) => (
          <Form>
            <FormWrapper
              title={currentLanguage === "en" ? "Create an account" : "Krijoni një llogari"}
            >
              <FormInput
                placeholder={currentLanguage === "en" ? "Full Name" : "Emri i Plotë"}
                name="fullName"
                type="text"
                error={errors.fullName}
                touched={touched.fullName}
              />

              <FormInput
                placeholder={currentLanguage === "en" ? "Email Address" : "Email Adresa"}
                name="email"
                type="email"
                error={errors.email}
                touched={touched.email}
              />

              <div className="client-selections">
                <div className="selection">
                  <CustomSelect
                    data={countryData}
                    title={currentLanguage === "en" ? "Select Country" : "Zgjidhni shtetin"}
                    onSelectChange={(event: any) => handleCountryChange(event, setFieldValue)}
                    value={values.country}
                    error={errors.country}
                    touched={touched.country}
                  />
                </div>

                <div className="selection">
                  <CustomSelect
                    data={cities}
                    title={currentLanguage === "en" ? "Select City" : "Zgjidhni qytetin"}
                    onSelectChange={(event: any) => setFieldValue("city", event.target.value)}
                    value={values.city}
                    error={errors.city}
                    touched={touched.city}
                  />
                </div>
              </div>

              <Field name="phone">
                {({ field, form }: any) => (
                  <PhoneNumberInput
                    value={field.value}
                    onChange={(value: any) => form.setFieldValue("phone", value)}
                    error={(errors.phone as any)?.phone}
                    touched={(touched.phone as any)?.phone}
                  />
                )}
              </Field>

              <FormInput
                placeholder={currentLanguage === "en" ? "Address" : "Adresa"}
                name="address"
                type="text"
                error={errors.address}
                touched={touched.address}
              />

              <FormInput
                placeholder={currentLanguage === "en" ? "Password" : "Fjalëkalimi"}
                name="password"
                type="password"
                error={errors.password}
                touched={touched.password}
              />

              {/* GLOBAL ERROR - render inside the form so it shows reliably */}
              {generalError && (
                <div className="error-message--global">{generalError}</div>
              )}

              <BlueButton type="submit" disabled={isSubmitting || loading}>
                {loading
                  ? currentLanguage === "en" ? "Loading..." : "Duke u ngarkuar..."
                  : currentLanguage === "en" ? "Register" : "Vazhdoni"}
                <br />
              </BlueButton>

              <span className="register-privacy-policy">
                {currentLanguage === "en"
                  ? "By creating an account, you agree "
                  : "Duke krijuar një llogari, ju pranoni "}
                <a href="/privacy-policy">
                  {currentLanguage === "en"
                    ? "Our Privacy Policy Terms"
                    : "Kushtet tona të Politikës së Privatësisë"}{" "}
                </a>
              </span>
            </FormWrapper>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Client;






