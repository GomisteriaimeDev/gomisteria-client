import React, { useRef, useState } from "react";
import styles from "./Verification.module.scss";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import phone from "../../assets/svg/phone.svg";
import logo from "../../assets/svg/Logo.svg";

const Verification: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Type-safe access to route state
  const state = location.state as { phone?: string } | null;
  const phoneNumber = state?.phone;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCodeArray = code.split("");
    newCodeArray[index] = value;
    const updatedCode = newCodeArray.join("");
    setCode(updatedCode);

    if (value.length === 1 && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleVerification = async () => {
    try {
      const res = await axios.post(
        "https://gomisteria-api.onrender.com/api/users/verify-phone",
        {
          userId: id,
          code,
        }
      );
      console.log(res.data.success.role);
      if (res.data) {
        setSuccess(true);
        setTimeout(() => {
          if (res.data.success.role === "client") {
            navigate("/register/client/success");
          }
          if (res.data.success.role === "business") {
            navigate("/register/business/success");
          }
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed.");
    }
  };

  return (
    <div className={styles.container}>
      <img src={logo} alt="GomisteriaIme Logo" className={styles.logo} />

      <div className={styles.innerDiv}>
        <img src={phone} className={styles.phoneIcon} alt="phone Icon" />

        <h5>Vendos kodin e verifikimit</h5>
        <p>
          Një mesazh me tekst me një kod verifikimi sapo u dërgua në
          <br />
          <strong>{phoneNumber || "+383 12 456 789"}</strong>
        </p>

        <div className={styles.codeInputGroup}>
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={styles.codeInput}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              onChange={(e) => handleChange(e, i)}
            />
          ))}
        </div>

        <button onClick={handleVerification} className={styles.submitBtn}>
          Vazhdo
        </button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">Verified successfully!</div>}

        <p className={styles.terms}>
          Duke krijuar një llogari, ju pranoni{" "}
          <a href="/privacy-policy">Kushtet tona të Politikës së Privatësisë</a>
        </p>
      </div>

      <p className={styles.help}>
        Për çdo problem gjatë regjistrimit, ju lutemi kontaktoni qendrën e
        thirrjeve +383 45 522 222
      </p>
    </div>
  );
};

export default Verification;
