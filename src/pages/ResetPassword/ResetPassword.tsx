import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

import logo from "../../assets/svg/Logo.svg";
import FormWrapper from "../../components/Form/Form";
import FormInput from "../../components/FormInput/FormInput";
import BlueButton from "../../components/BlueButton/BlueButton";

import "./ResetPassword.scss";
import { useLanguage } from "../../context/Language";

const ResetPassword = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const toggleLanguage = () => {
    setLanguage(currentLanguage === "sq" ? "en" : "sq");
  };

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(
        6,
        currentLanguage === "en"
          ? "Password must be at least 6 characters"
          : "Fjalëkalimi duhet të ketë të paktën 6 karaktere"
      )
      .required(
        currentLanguage === "en"
          ? "Password is required"
          : "Fusha e fjalëkalimit është e detyrueshme."
      ),
    passwordConfirm: Yup.string()
      .oneOf(
        [Yup.ref("password")],
        currentLanguage === "en"
          ? "Passwords do not match"
          : "Fjalëkalimet nuk përputhen."
      )
      .required(
        currentLanguage === "en"
          ? "Please confirm your password"
          : "Fusha e konfirmimit të fjalëkalimit është e detyrueshme."
      ),
  });

  if (!token) {
    return (
      <div className="resetPasswordWrapper">
        <img src={logo} alt="gomisteriaLogo" className="intro-logo" />
        <FormWrapper
          title={
            currentLanguage === "en"
              ? "Invalid Link"
              : "Lidhje e Pavlefshme"
          }
        >
          <div className="resetPassword-message">
            <p>
              {currentLanguage === "en"
                ? "This password reset link is invalid. Please request a new one."
                : "Kjo lidhje për rivendosjen e fjalëkalimit është e pavlefshme. Ju lutem kërkoni një të re."}
            </p>
            <a href="/forgot-password">
              {currentLanguage === "en"
                ? "Request New Link"
                : "Kërko Lidhje të Re"}
            </a>
          </div>
        </FormWrapper>
      </div>
    );
  }

  if (success) {
    return (
      <div className="resetPasswordWrapper">
        <img src={logo} alt="gomisteriaLogo" className="intro-logo" />
        <FormWrapper
          title={
            currentLanguage === "en"
              ? "Password Reset Successfully"
              : "Fjalëkalimi u Rivendos me Sukses"
          }
        >
          <div className="resetPassword-message">
            <p>
              {currentLanguage === "en"
                ? "Your password has been successfully reset. You can now log in with your new password."
                : "Fjalëkalimi juaj është rivendosur me sukses. Tani mund të identifikoheni me fjalëkalimin tuaj të ri."}
            </p>
            <a href="/login">
              {currentLanguage === "en"
                ? "Go to Login"
                : "Shko te Hyrja"}
            </a>
          </div>
        </FormWrapper>
      </div>
    );
  }

  return (
    <div className="resetPasswordWrapper">
      <button onClick={toggleLanguage} className="languageToggle-auth">
        {currentLanguage === "en" ? (
          <img src="https://flagcdn.com/w40/gb.png" alt="English" />
        ) : (
          <img src="https://flagcdn.com/w40/al.png" alt="Shqip" />
        )}
      </button>
      <img src={logo} alt="gomisteriaLogo" className="intro-logo" />

      <Formik
        initialValues={{
          password: "",
          passwordConfirm: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setGeneralError(null);
          try {
            await axios.post(
              `https://gomisteria-api.onrender.com/api/users/reset-password?token=${token}`,
              { newPassword: values.password }
            );
            setSuccess(true);
          } catch (err: any) {
            const message = err?.response?.data?.message;
            if (typeof message === "string") {
              setGeneralError(message);
            } else {
              setGeneralError(
                currentLanguage === "en"
                  ? "The reset link is invalid or has expired. Please request a new one."
                  : "Lidhja e rivendosjes është e pavlefshme ose ka skaduar. Ju lutem kërkoni një të re."
              );
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <FormWrapper
            title={
              currentLanguage === "en"
                ? "Reset Password"
                : "Rivendosni Fjalëkalimin"
            }
          >
            <Form className="resetPassword-form">
              <div className="resetPassword-inputs">
                <FormInput
                  name="password"
                  placeholder={
                    currentLanguage === "en"
                      ? "New Password"
                      : "Fjalëkalimi i ri"
                  }
                  type="password"
                />
                <FormInput
                  name="passwordConfirm"
                  placeholder={
                    currentLanguage === "en"
                      ? "Confirm New Password"
                      : "Konfirmoni fjalëkalimin e ri"
                  }
                  type="password"
                />
              </div>

              {generalError && (
                <div className="error-message--global">{generalError}</div>
              )}

              <BlueButton type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? currentLanguage === "en"
                    ? "Resetting..."
                    : "Duke rivendosur..."
                  : currentLanguage === "en"
                  ? "Reset Password"
                  : "Rivendosni Fjalëkalimin"}
              </BlueButton>
            </Form>
          </FormWrapper>
        )}
      </Formik>

      <div className="resetPassword-bottom">
        <p>
          {currentLanguage === "en"
            ? "For any problems during registration, please contact the call center +383 45 522 222"
            : "Për çdo problem gjatë regjistrimit, ju lutemi kontaktoni qendrën e thirrjeve +383 45 522 222"}
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
