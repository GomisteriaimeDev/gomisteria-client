import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

import logo from "../../assets/svg/Logo.svg";
import FormWrapper from "../../components/Form/Form";
import FormInput from "../../components/FormInput/FormInput";
import BlueButton from "../../components/BlueButton/BlueButton";
import PhoneNumberInput from "../../components/PhoneNumberInput/PhoneNumberInput";
import codeStyles from "../Verification/Verification.module.scss";

import "./ForgotPassword.scss";
import { useLanguage } from "../../context/Language";

const API = "https://gomisteria-api.onrender.com/api/users";
const RESEND_SECONDS = 60;

type Step = "phone" | "code" | "account" | "password" | "done";
type Account = { token: string; email: string; name: string };

const ForgotPassword = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const toggleLanguage = () => {
    setLanguage(currentLanguage === "sq" ? "en" : "sq");
  };
  const t = (en: string, sq: string) => (currentLanguage === "en" ? en : sq);

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const codeInputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const sendCode = async (fullPhone: string) => {
    setGeneralError(null);
    setIsBusy(true);
    try {
      await axios.post(`${API}/request-password-reset-sms`, {
        phone: fullPhone,
        portal: "client",
      });
      setPhone(fullPhone);
      setCode(Array(6).fill(""));
      setResendIn(RESEND_SECONDS);
      setStep("code");
    } catch (err: any) {
      const errorCode = err?.response?.data?.code;
      const status = err?.response?.status;
      setGeneralError(
        errorCode === "RESET_SMS_COOLDOWN" || status === 429
          ? t(
              "Please wait a minute before requesting a new code.",
              "Ju lutem prisni një minutë para se të kërkoni një kod të ri."
            )
          : t(
              "We couldn't send the SMS. Please try again later.",
              "Nuk mundëm të dërgojmë SMS-në. Ju lutem provoni më vonë."
            )
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handleCodeChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);
    if (value && index < 5) codeInputsRef.current[index + 1]?.focus();
  };

  const handleCodeKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!digits) return;
    e.preventDefault();
    setCode(digits.padEnd(6, " ").split("").map((d) => d.trim()));
    codeInputsRef.current[Math.min(digits.length, 5)]?.focus();
  };

  const verifyCode = async () => {
    const joined = code.join("");
    if (joined.length !== 6) {
      setGeneralError(
        t("Please enter the 6-digit code.", "Ju lutem vendosni kodin me 6 shifra.")
      );
      return;
    }
    setGeneralError(null);
    setIsBusy(true);
    try {
      const res = await axios.post(`${API}/verify-reset-code`, {
        phone,
        portal: "client",
        code: joined,
      });
      const found: Account[] = res?.data?.accounts ?? [];
      if (found.length === 1) {
        setToken(found[0].token);
        setStep("password");
      } else {
        setAccounts(found);
        setStep("account");
      }
    } catch (err) {
      setGeneralError(
        t(
          "The code is wrong or has expired. Check it or request a new one.",
          "Kodi është i gabuar ose ka skaduar. Kontrolloni ose kërkoni një të ri."
        )
      );
    } finally {
      setIsBusy(false);
    }
  };

  const phoneSchema = Yup.object().shape({
    phone: Yup.object({
      phone: Yup.string()
        .matches(
          /^[\d\s]+$/,
          t("Phone number is not valid", "Numri i telefonit nuk është i vlefshëm")
        )
        .required(
          t(
            "Please provide your phone number.",
            "Ju lutem vendosni numrin tuaj të telefonit."
          )
        ),
      countryCode: Yup.string().required(),
    }),
  });

  const passwordSchema = Yup.object().shape({
    password: Yup.string()
      .min(
        6,
        t(
          "Password must be at least 6 characters",
          "Fjalëkalimi duhet të ketë të paktën 6 karaktere"
        )
      )
      .required(
        t("Password is required", "Fusha e fjalëkalimit është e detyrueshme.")
      ),
    passwordConfirm: Yup.string()
      .oneOf(
        [Yup.ref("password")],
        t("Passwords do not match", "Fjalëkalimet nuk përputhen.")
      )
      .required(
        t(
          "Please confirm your password",
          "Fusha e konfirmimit të fjalëkalimit është e detyrueshme."
        )
      ),
  });

  const backToLogin = (
    <a href="/login">{t("Back to Login", "Kthehu te Hyrja")}</a>
  );

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

      {step === "phone" && (
        <Formik
          initialValues={{ phone: { phone: "", countryCode: "+383" } }}
          validationSchema={phoneSchema}
          onSubmit={(values) =>
            sendCode(`${values.phone.countryCode}${values.phone.phone}`)
          }
        >
          {({ errors, touched }) => (
            <FormWrapper
              title={t("Forgot Password", "Keni Harruar Fjalëkalimin")}
            >
              <Form className="forgotPassword-form">
                <p className="forgotPassword-description">
                  {t(
                    "Enter the phone number of your account and we'll send you a code by SMS.",
                    "Vendosni numrin e telefonit të llogarisë suaj dhe ne do t'ju dërgojmë një kod me SMS."
                  )}
                </p>
                <div className="forgotPassword-inputs">
                  <Field name="phone">
                    {({ field, form }: any) => (
                      <PhoneNumberInput
                        value={field.value}
                        onChange={(value: any) =>
                          form.setFieldValue("phone", value)
                        }
                        error={(errors.phone as any)?.phone}
                        touched={(touched.phone as any)?.phone}
                      />
                    )}
                  </Field>
                </div>

                {generalError && (
                  <div className="error-message--global">{generalError}</div>
                )}

                <BlueButton type="submit" disabled={isBusy}>
                  {isBusy
                    ? t("Sending...", "Duke dërguar...")
                    : t("Send Code", "Dërgo Kodin")}
                </BlueButton>
                {backToLogin}
              </Form>
            </FormWrapper>
          )}
        </Formik>
      )}

      {step === "code" && (
        <FormWrapper title={t("Enter the Code", "Vendosni Kodin")}>
          <div className="forgotPassword-form">
            <p className="forgotPassword-description">
              {t(
                "If this number belongs to an account, we sent a 6-digit code to",
                "Nëse ky numër i përket një llogarie, ne dërguam një kod me 6 shifra në"
              )}{" "}
              <strong>{phone}</strong>
            </p>
            <div className={codeStyles.codeInputGroup}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  className={codeStyles.codeInput}
                  ref={(el) => {
                    codeInputsRef.current[i] = el;
                  }}
                  onChange={(e) => handleCodeChange(e.target.value, i)}
                  onKeyDown={(e) => handleCodeKeyDown(e, i)}
                  onPaste={handleCodePaste}
                />
              ))}
            </div>

            {generalError && (
              <div className="error-message--global">{generalError}</div>
            )}

            <BlueButton type="button" onClick={verifyCode} disabled={isBusy}>
              {isBusy ? t("Checking...", "Duke kontrolluar...") : t("Continue", "Vazhdo")}
            </BlueButton>

            {resendIn > 0 ? (
              <p className="forgotPassword-description">
                {t("Resend code in", "Ridërgo kodin pas")} {resendIn}s
              </p>
            ) : (
              <a
                href="#resend"
                onClick={(e) => {
                  e.preventDefault();
                  if (!isBusy) sendCode(phone);
                }}
              >
                {t("Resend code", "Ridërgo kodin")}
              </a>
            )}
            <a
              href="#change-number"
              onClick={(e) => {
                e.preventDefault();
                setGeneralError(null);
                setStep("phone");
              }}
            >
              {t("Change number", "Ndrysho numrin")}
            </a>
          </div>
        </FormWrapper>
      )}

      {step === "account" && (
        <FormWrapper title={t("Choose Account", "Zgjidhni Llogarinë")}>
          <div className="forgotPassword-form">
            <p className="forgotPassword-description">
              {t(
                "This number is used by more than one account. Which one do you want to reset?",
                "Ky numër përdoret nga më shumë se një llogari. Cilën dëshironi të rivendosni?"
              )}
            </p>
            <div className="forgotPassword-inputs">
              {accounts.map((account) => (
                <BlueButton
                  key={account.token}
                  type="button"
                  onClick={() => {
                    setToken(account.token);
                    setStep("password");
                  }}
                >
                  {account.name ? `${account.name} · ` : ""}
                  {account.email}
                </BlueButton>
              ))}
            </div>
            {backToLogin}
          </div>
        </FormWrapper>
      )}

      {step === "password" && (
        <Formik
          initialValues={{ password: "", passwordConfirm: "" }}
          validationSchema={passwordSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setGeneralError(null);
            try {
              await axios.post(
                `${API}/reset-password`,
                { newPassword: values.password },
                { params: { token } }
              );
              setStep("done");
            } catch (err) {
              setGeneralError(
                t(
                  "This reset has expired. Please start again.",
                  "Kjo rivendosje ka skaduar. Ju lutem filloni përsëri."
                )
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <FormWrapper
              title={t("Reset Password", "Rivendosni Fjalëkalimin")}
            >
              <Form className="forgotPassword-form">
                <div className="forgotPassword-inputs">
                  <FormInput
                    name="password"
                    placeholder={t("New Password", "Fjalëkalimi i ri")}
                    type="password"
                  />
                  <FormInput
                    name="passwordConfirm"
                    placeholder={t(
                      "Confirm New Password",
                      "Konfirmoni fjalëkalimin e ri"
                    )}
                    type="password"
                  />
                </div>

                {generalError && (
                  <div className="error-message--global">{generalError}</div>
                )}

                <BlueButton type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? t("Resetting...", "Duke rivendosur...")
                    : t("Reset Password", "Rivendosni Fjalëkalimin")}
                </BlueButton>
              </Form>
            </FormWrapper>
          )}
        </Formik>
      )}

      {step === "done" && (
        <FormWrapper
          title={t(
            "Password Reset Successfully",
            "Fjalëkalimi u Rivendos me Sukses"
          )}
        >
          <div className="forgotPassword-success">
            <p>
              {t(
                "You can now log in with your new password.",
                "Tani mund të identifikoheni me fjalëkalimin tuaj të ri."
              )}
            </p>
            <a href="/login">{t("Go to Login", "Shko te Hyrja")}</a>
          </div>
        </FormWrapper>
      )}

      <div className="forgotPassword-bottom">
        <p>
          {t(
            "For any problems, please contact the call center +383 45 522 222",
            "Për çdo problem, ju lutemi kontaktoni qendrën e thirrjeve +383 45 522 222"
          )}
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
