import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import "./Login.scss";
import logo from "../../assets/svg/Logo.svg";
import FormInput from "../../components/FormInput/FormInput";
import BlueButton from "../../components/BlueButton/BlueButton";
import OutlineButton from "../../components/OutlineButton/OutlineButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/Language";

type BackendErrorData = {
  code?: string;
  message?: string | string[];
  errors?: Record<string, string>;
  userId?: string;
  phone?: string;
};

const Login = () => {
  const navigate = useNavigate();
  const { currentLanguage, setLanguage } = useLanguage();
  const toggleLanguage = () =>
    setLanguage(currentLanguage === "sq" ? "en" : "sq");

  const { login } = useAuth();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validationSchema = Yup.object({
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
    password: Yup.string().required(
      currentLanguage === "en"
        ? "Please provide the password"
        : "Ju lutem vendosni fjalëkalimin"
    ),
  });

  const messageForCode = (code?: string, backendMessage?: string | string[]) => {
    if (code === "AUTH_NOT_ACTIVATED") {
      return currentLanguage === "en"
        ? "Your account must be activated before you can log in."
        : "Llogaria juaj duhet të aktivizohet para se të identifikoheni.";
    }

    if (code === "AUTH_INVALID_CREDENTIALS") {
      return currentLanguage === "en"
        ? "Invalid email or password."
        : "Emaili ose fjalëkalimi është i pasaktë.";
    }

    // For unknown error codes, show the backend message if available
    if (backendMessage && typeof backendMessage === "string") {
      return backendMessage;
    }

    return currentLanguage === "en"
      ? "Invalid email or password."
      : "Emaili ose fjalëkalimi është i pasaktë.";
  };

  return (
    <div className="loginWrapper">
      <button onClick={toggleLanguage} className="languageToggle-auth">
        {currentLanguage === "en" ? (
          <img src="https://flagcdn.com/w40/gb.png" alt="English" />
        ) : (
          <img src="https://flagcdn.com/w40/al.png" alt="Shqip" />
        )}
      </button>

      <img src={logo} alt="gomisteriaLogo" className="intro-logo" />

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setGeneralError(null);

          try {
            await login(values.email, values.password);
            // AuthContext will not navigate now; we do it here.
            navigate("/home");
          } catch (err: any) {
            // Axios error normalization
            const status = err?.response?.status;
            const data: BackendErrorData | undefined = err?.response?.data;

            // If backend returns field-level errors:
            // { errors: { email: "...", password: "..." } }
            if (status === 400 && data?.errors) {
              setErrors(data.errors);
              setSubmitting(false);
              return;
            }

            if (status === 401) {
              if (data?.code === "AUTH_PHONE_NOT_VERIFIED") {
                navigate(`/verify-phone/${data.userId}`, {
                  state: { phone: data.phone },
                });
                return;
              }
              setGeneralError(messageForCode(data?.code, data?.message));
              setSubmitting(false);
              return;
            }

            // fallback
            setGeneralError(
              currentLanguage === "en"
                ? "Login failed. Please try again later."
                : "Identifikimi dështoi. Ju lutemi provoni më vonë."
            );
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="formWrapper">
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="Email"
            />

            <FormInput
              label={currentLanguage === "en" ? "Password" : "Fjalëkalimi"}
              name="password"
              type="password"
              placeholder={
                currentLanguage === "en" ? "Password" : "Fjalëkalimi"
              }
            />

            <div className="login-checkbox">
              <input type="checkbox" name="rememberMe" />
              <label htmlFor="rememberMe">
                {currentLanguage === "en" ? "Remember me" : "Më mbaj në mend"}
              </label>
            </div>

            {generalError && (
              <div className="error-message--global">{generalError}</div>
            )}

            <BlueButton type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? currentLanguage === "en" ? "Loading..." : "Duke u ngarkuar..."
                : currentLanguage === "en" ? "Login" : "Hyr"}
            </BlueButton>

            <a href="/forgot-password">
              {currentLanguage === "en"
                ? "Forgot your password"
                : "Keni harruar fjalëkalimin tuaj"}
              ?
            </a>
          </Form>
        )}
      </Formik>

      <div className="login-bottom">
        <span>
          {currentLanguage === "en"
            ? "Don't have an account"
            : "Nuk keni ende një llogari"}
          ?
        </span>

        <a href="/register/select">
          <OutlineButton>
            {currentLanguage === "en"
              ? "Create an account"
              : "Krijo një llogari"}
          </OutlineButton>
        </a>
      </div>
    </div>
  );
};

export default Login;
