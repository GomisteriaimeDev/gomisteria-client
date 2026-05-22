import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";

import logo from "../../assets/svg/Logo.svg";
import FormWrapper from "../../components/Form/Form";
import FormInput from "../../components/FormInput/FormInput";
import BlueButton from "../../components/BlueButton/BlueButton";

import "./ForgotPassword.scss";
import { useLanguage } from "../../context/Language";

const ForgotPassword = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const toggleLanguage = () => {
    setLanguage(currentLanguage === "sq" ? "en" : "sq");
  };

  const [submitted, setSubmitted] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(
        currentLanguage === "en"
          ? "Invalid email address"
          : "Email i pavlefshëm"
      )
      .required(
        currentLanguage === "en"
          ? "Please provide a valid email address"
          : "Ju lutem vendosni një email të vlefshëm"
      ),
  });

  return (
    <div className="forgotPasswordWrapper">
      <button onClick={toggleLanguage} className="languageToggle-auth">
        {currentLanguage === "en" ? (
          <img src="https://flagcdn.com/w40/gb.png" alt="English" />
        ) : (
          <img src="https://flagcdn.com/w40/al.png" alt="Shqip" />
        )}
      </button>
      <img src={logo} alt="gomisteriaLogo" className="intro-logo" />

      {submitted ? (
        <FormWrapper
          title={
            currentLanguage === "en"
              ? "Check Your Email"
              : "Kontrolloni Email-in Tuaj"
          }
        >
          <div className="forgotPassword-success">
            <p>
              {currentLanguage === "en"
                ? "If an account with that email exists, we have sent a password reset link to it. Please check your inbox."
                : "Nëse ekziston një llogari me atë email, ne kemi dërguar një lidhje për rivendosjen e fjalëkalimit. Ju lutem kontrolloni kutinë tuaj hyrëse."}
            </p>
            <a href="/login">
              {currentLanguage === "en"
                ? "Back to Login"
                : "Kthehu te Hyrja"}
            </a>
          </div>
        </FormWrapper>
      ) : (
        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setGeneralError(null);
            try {
              await axios.post(
                "https://gomisteria-api.onrender.com/api/users/request-password-reset",
                { email: values.email }
              );
              setSubmitted(true);
            } catch (err: any) {
              // Always show success message for security (don't reveal if email exists)
              setSubmitted(true);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <FormWrapper
              title={
                currentLanguage === "en"
                  ? "Forgot Password"
                  : "Keni Harruar Fjalëkalimin"
              }
            >
              <Form className="forgotPassword-form">
                <p className="forgotPassword-description">
                  {currentLanguage === "en"
                    ? "Enter your email address and we'll send you a link to reset your password."
                    : "Vendosni adresën tuaj të email-it dhe ne do t'ju dërgojmë një lidhje për të rivendosur fjalëkalimin tuaj."}
                </p>
                <div className="forgotPassword-inputs">
                  <FormInput
                    name="email"
                    placeholder="Email"
                    type="email"
                  />
                </div>

                {generalError && (
                  <div className="error-message--global">{generalError}</div>
                )}

                <BlueButton type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? currentLanguage === "en"
                      ? "Sending..."
                      : "Duke dërguar..."
                    : currentLanguage === "en"
                    ? "Send Reset Link"
                    : "Dërgo Lidhjen e Rivendosjes"}
                </BlueButton>

                <a href="/login">
                  {currentLanguage === "en"
                    ? "Back to Login"
                    : "Kthehu te Hyrja"}
                </a>
              </Form>
            </FormWrapper>
          )}
        </Formik>
      )}

      <div className="forgotPassword-bottom">
        <p>
          {currentLanguage === "en"
            ? "For any problems during registration, please contact the call center +383 45 522 222"
            : "Për çdo problem gjatë regjistrimit, ju lutemi kontaktoni qendrën e thirrjeve +383 45 522 222"}
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
