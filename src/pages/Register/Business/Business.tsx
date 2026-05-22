import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import "./Business.scss";
import logo from "../../../assets/svg/Logo.svg";
import FormWrapper from "../../../components/Form/Form";
import FormInput from "../../../components/FormInput/FormInput";
import BlueButton from "../../../components/BlueButton/BlueButton";
import PhoneNumberInput from "../../../components/PhoneNumberInput/PhoneNumberInput";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../../../components/FormSelect/FormSelect";
import MapComponent from "../../../components/MapComponent/MapComponent";
import { useLanguage } from "../../../context/Language";
import { countryData, cityData } from "../../../data/locations";

interface Phone {
  phone: string;
  countryCode: string;
}
interface WorkingHour {
  day: string;
  openingHour: string;
  closingHour: string;
}

interface BusinessFormValues {
  companyName: string;
  email: string;
  country: string;
  city: string;
  password: string;
  phone: Phone;
  address: string;
  nrARBK: string;
  businessType: string;
  roadAssistance: string;
  alwaysAvailable: boolean;
  workingHours: WorkingHour[];
  services: string[];
  latitude: number | null;
  longitude: number | null;
}

type BackendErrorData = {
  code?: string;
  message?: string | string[];
  errors?: Record<string, string>;
};

const initialValues: BusinessFormValues = {
  companyName: "",
  email: "",
  country: "",
  city: "",
  password: "",
  phone: { phone: "", countryCode: "+383" },
  address: "",
  nrARBK: "",
  businessType: "Autosallon",
  roadAssistance: "",
  alwaysAvailable: false,
  workingHours: [
    { day: "Monday", openingHour: "", closingHour: "" },
    { day: "Tuesday", openingHour: "", closingHour: "" },
    { day: "Wednesday", openingHour: "", closingHour: "" },
    { day: "Thursday", openingHour: "", closingHour: "" },
    { day: "Friday", openingHour: "", closingHour: "" },
    { day: "Saturday", openingHour: "", closingHour: "" },
    { day: "Sunday", openingHour: "", closingHour: "" },
  ],
  services: [],
  latitude: null,
  longitude: null,
};

const Business: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const toggleLanguage = () =>
    setLanguage(currentLanguage === "sq" ? "en" : "sq");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [services, setServices] = useState<{ value: string; label: string }[]>(
    []
  );
  const [businessTypeOptions, setBusinessTypeOptions] = useState<string[]>([]);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validationSchema = Yup.object({
    companyName: Yup.string().required(
      currentLanguage === "en"
        ? "Please provide the company name."
        : "Ju lutem shkruani emrin e kompanisë."
    ),
    email: Yup.string()
      .email(
        currentLanguage === "en"
          ? "Invalid email address"
          : "Email i pavlefshëm"
      )
      .required(
        currentLanguage === "en"
          ? "Please provide an email address."
          : "Ju lutem vendosni email."
      ),
    country: Yup.string().required(
      currentLanguage === "en"
        ? "Please provide the required field."
        : "Ju lutem plotësoni fushën e kërkuar."
    ),
    city: Yup.string().required(
      currentLanguage === "en"
        ? "Please provide the required field."
        : "Ju lutem plotësoni fushën e kërkuar."
    ),
    password: Yup.string().required(
      currentLanguage === "en"
        ? "Please provide a password."
        : "Ju lutem vendosni një fjalëkalim."
    ),
    phone: Yup.object({
      phone: Yup.string()
        .matches(
          /^\d+$/,
          currentLanguage === "en"
            ? "Phone number is not valid"
            : "Numri i telefonit nuk është i vlefshëm"
        )
        .required(
          currentLanguage === "en"
            ? "Please provide the required field."
            : "Ju lutem plotësoni fushën e kërkuar."
        ),
      countryCode: Yup.string().required(
        currentLanguage === "en"
          ? "Please provide the required field."
          : "Ju lutem plotësoni fushën e kërkuar."
      ),
    }).required(
      currentLanguage === "en"
        ? "Please provide the required field."
        : "Ju lutem plotësoni fushën e kërkuar."
    ),
    address: Yup.string().required(
      currentLanguage === "en"
        ? "Please provide the required field."
        : "Ju lutem plotësoni fushën e kërkuar."
    ),
    nrARBK: Yup.string().required(
      currentLanguage === "en"
        ? "Please provide the required field."
        : "Ju lutem plotësoni fushën e kërkuar."
    ),
    businessType: Yup.string().required(
      currentLanguage === "en"
        ? "Please provide the required field."
        : "Ju lutem plotësoni fushën e kërkuar."
    ),
    roadAssistance: Yup.string().when("businessType", {
      is: "Karrotrec",
      then: (schema) =>
        schema.required(
          currentLanguage === "en"
            ? "Please select road assistance option."
            : "Ju lutem zgjidhni asistencën rrugore."
        ),
      otherwise: (schema) => schema.nullable(),
    }),
    workingHours: Yup.array().when(["businessType", "roadAssistance"], {
      is: (businessType: any, roadAssistance: any) =>
        (businessType === "Karrotrec" || businessType === "Gomisteri") &&
        roadAssistance === "Po",
      then: (schema) =>
        schema.min(
          1,
          currentLanguage === "en"
            ? "Please select at least one working hour."
            : "Ju lutem zgjidhni të paktën një orar pune."
        ),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "https://gomisteria-api.onrender.com/api/services"
        );
        const serviceOptions = response.data.map((service: any) => ({
          value: service.id,
          label: service.name,
        }));
        setServices(serviceOptions);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchBusinessTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://gomisteria-api.onrender.com/api/business-types",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const businessTypeNames = response.data.map((bt: any) => bt.name);
        setBusinessTypeOptions(businessTypeNames);
      } catch (error) {
        console.error("Failed to fetch business types:", error);
      }
    };
    fetchBusinessTypes();
  }, []);

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

  const handleBusiness = async (
    values: BusinessFormValues,
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

    const {
      email,
      password,
      nrARBK,
      businessType,
      companyName,
      address,
      country,
      city,
      phone,
      roadAssistance,
      alwaysAvailable,
      workingHours,
      services,
      latitude,
      longitude,
      ...rest
    } = values;

    const formattedWorkingHours = values.workingHours.map((day) => ({
      day: day.day,
      openingHour: day.openingHour || "closed",
      closingHour: day.closingHour || "closed",
    }));

    const dataToSend = {
      email,
      password,
      address,
      specialFields: {
        nrARBK,
        businessType,
        companyName,
        country,
        city,
        phone: `${phone.countryCode}${phone.phone}`,
        roadAssistance:
          businessType === "Karrotrec" || businessType === "Gomisteri"
            ? roadAssistance
            : undefined,
        alwaysAvailable:
          (businessType === "Karrotrec" || businessType === "Gomisteri") &&
          roadAssistance === "Po"
            ? alwaysAvailable
            : undefined,
        workingHours:
          (businessType === "Karrotrec" || businessType === "Gomisteri") &&
          roadAssistance === "Po" && !alwaysAvailable
            ? formattedWorkingHours
            : undefined,
        services,
        latitude,
        longitude,
        ...rest,
      },
    };

    try {
      const response = await axios.post(
        "https://gomisteria-api.onrender.com/api/users/registerBusiness",
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

      // field-level validation errors from backend:
      if (status === 400 && data?.errors) {
        setErrors(data.errors);
        setSubmitting(false);
        setLoading(false);
        return;
      }

      // email already in use:
      if (status === 409) {
        const msg = messageForRegisterCode(data?.code, data?.message);
        setErrors({ email: msg });
        setGeneralError(msg);
        setSubmitting(false);
        setLoading(false);
        return;
      }

      // other controlled errors:
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

  const dayTranslations: any = {
    Monday: "E Hënë",
    Tuesday: "E Martë",
    Wednesday: "E Mërkurë",
    Thursday: "E Enjte",
    Friday: "E Premte",
    Saturday: "E Shtunë",
    Sunday: "E Diel",
  };

  return (
    <div className="businessWrapper">
      <button onClick={toggleLanguage} className="languageToggle-auth">
        {currentLanguage === "en" ? (
          <img src="https://flagcdn.com/w40/gb.png" alt="English" />
        ) : (
          <img src="https://flagcdn.com/w40/al.png" alt="Shqip" />
        )}
      </button>

      <img src={logo} alt="Logo" className="intro-logo" />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleBusiness}
      >
        {({ isSubmitting, setFieldValue, values, errors, touched }) => (
          <Form>
            <FormWrapper
              title={
                currentLanguage === "en"
                  ? "Create an account"
                  : "Krijoni një llogari"
              }
            >
              <div className="business-selection">
                <CustomSelect
                  data={businessTypeOptions}
                  title={
                    currentLanguage === "en"
                      ? "Select Business Type"
                      : "Zgjidhni llojin e biznesit"
                  }
                  onSelectChange={(event: any) =>
                    setFieldValue("businessType", event.target.value)
                  }
                  value={values.businessType}
                  error={errors.businessType}
                  touched={touched.businessType}
                />

                {(values.businessType === "Karrotrec" ||
                  values.businessType === "Gomisteri") && (
                  <>
                    <p className="radio-title">
                      {currentLanguage === "en"
                        ? "Do you provide road assistance"
                        : "A beni asistencë rrugore"}
                      ?
                    </p>

                    <div id="roadAssistance" className="radio-details">
                      <>
                        <input
                          type="radio"
                          value="Po"
                          name="roadAssistance"
                          checked={values.roadAssistance === "Po"}
                          onChange={(event: any) =>
                            setFieldValue("roadAssistance", event.target.value)
                          }
                        />{" "}
                        {currentLanguage === "en" ? "Yes" : "Po"}
                      </>
                      <>
                        <input
                          type="radio"
                          value="Jo"
                          name="roadAssistance"
                          checked={values.roadAssistance === "Jo"}
                          onChange={(event: any) =>
                            setFieldValue("roadAssistance", event.target.value)
                          }
                        />{" "}
                        {currentLanguage === "en" ? "No" : "Jo"}
                      </>
                    </div>

                    {errors.roadAssistance && touched.roadAssistance && (
                      <div className="error-message">
                        {errors.roadAssistance as any}
                      </div>
                    )}

                    {values.roadAssistance === "Po" && (
                      <div className="working-hours-group">
                        <p className="orari">
                          {currentLanguage === "en"
                            ? "Working Hours"
                            : "Orari i punës"}
                        </p>

                        <label className="always-available-label">
                          <input
                            type="checkbox"
                            checked={values.alwaysAvailable}
                            onChange={(e) => {
                              setFieldValue("alwaysAvailable", e.target.checked);
                            }}
                          />
                          {currentLanguage === "en"
                            ? "24/7 "
                            : "24/7 "}
                        </label>

                        {!values.alwaysAvailable && values.workingHours?.length ? (
                          values.workingHours.map((day, index) => (
                            <div key={index} className="working-hours-details">
                              <label>
                                {currentLanguage === "en"
                                  ? day.day
                                  : dayTranslations[day.day]}
                              </label>

                              <div className="working-hours-inputs">
                                <input
                                  type="time"
                                  value={day.openingHour || ""}
                                  onChange={(e) => {
                                    const updatedHours =
                                      values.workingHours.map((d, i) =>
                                        i === index
                                          ? {
                                              ...d,
                                              openingHour: e.target.value,
                                            }
                                          : d
                                      );
                                    setFieldValue("workingHours", updatedHours);
                                  }}
                                />

                                <input
                                  type="time"
                                  value={day.closingHour || ""}
                                  onChange={(e) => {
                                    const updatedHours =
                                      values.workingHours.map((d, i) =>
                                        i === index
                                          ? {
                                              ...d,
                                              closingHour: e.target.value,
                                            }
                                          : d
                                      );
                                    setFieldValue("workingHours", updatedHours);
                                  }}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="error-message">
                            {currentLanguage === "en"
                              ? "No working hours available."
                              : "Nuk ka orar pune të disponueshëm."}
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              <FormInput
                placeholder={
                  currentLanguage === "en" ? "UNIQUE No." : "Nr. UNIK"
                }
                name="nrARBK"
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                error={errors.nrARBK}
                touched={touched.nrARBK}
              />

              <FormInput
                placeholder={
                  currentLanguage === "en" ? "Company Name" : "Emri i Kompanisë"
                }
                name="companyName"
                type="text"
                error={errors.companyName}
                touched={touched.companyName}
              />

              <FormInput
                placeholder={
                  currentLanguage === "en" ? "Email Address" : "Email Adresa"
                }
                name="email"
                type="email"
                error={errors.email}
                touched={touched.email}
              />

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

              <div className="business-selections">
                <div className="selection">
                  <CustomSelect
                    data={countryData}
                    title={
                      currentLanguage === "en"
                        ? "Select Country"
                        : "Zgjidhni shtetin"
                    }
                    onSelectChange={(event: any) =>
                      handleCountryChange(event, setFieldValue)
                    }
                    value={values.country}
                    error={errors.country}
                    touched={touched.country}
                  />
                </div>

                <div className="selection">
                  <CustomSelect
                    data={cities}
                    title={
                      currentLanguage === "en"
                        ? "Select City"
                        : "Zgjidhni qytetin"
                    }
                    onSelectChange={(event: any) =>
                      setFieldValue("city", event.target.value)
                    }
                    value={values.city}
                    error={errors.city}
                    touched={touched.city}
                  />
                </div>
              </div>

              <FormInput
                placeholder={currentLanguage === "en" ? "Address" : "Adresa"}
                name="address"
                type="text"
                error={errors.address}
                touched={touched.address}
              />

              <FormInput
                placeholder={
                  currentLanguage === "en" ? "Password" : "Fjalëkalimi"
                }
                name="password"
                type="password"
                error={errors.password}
                touched={touched.password}
              />

              {values.businessType !== "Gomisteri" ? null : (
                <>
                  <Select
                    options={services}
                    isMulti
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={
                      currentLanguage === "en"
                        ? "Select Services"
                        : "Selekto Shërbime"
                    }
                    value={services.filter((service) =>
                      values.services.includes(service.value)
                    )}
                    onChange={(selectedOptions: any) =>
                      setFieldValue(
                        "services",
                        selectedOptions
                          ? selectedOptions.map((opt: any) => opt.value)
                          : []
                      )
                    }
                  />
                  {errors.services && touched.services && (
                    <div className="error-message">
                      {errors.services as any}
                    </div>
                  )}
                </>
              )}

              <h3>
                {currentLanguage === "en"
                  ? "Select Business Location"
                  : "Selekto lokacionin të biznesit"}
              </h3>

              <MapComponent
                onLocationSelected={(location: {
                  lat: number;
                  lng: number;
                }) => {
                  setFieldValue("latitude", location.lat);
                  setFieldValue("longitude", location.lng);
                }}
              />

              {errors.latitude && touched.latitude && (
                <div className="error-message">{errors.latitude as any}</div>
              )}
              {errors.longitude && touched.longitude && (
                <div className="error-message">{errors.longitude as any}</div>
              )}

              {/* GLOBAL ERROR - important: render inside the form */}
              {generalError && (
                <div className="error-message--global">{generalError}</div>
              )}

              <BlueButton type="submit" disabled={isSubmitting || loading}>
                {loading
                  ? currentLanguage === "en"
                    ? "Loading..."
                    : "Duke u ngarkuar..."
                  : currentLanguage === "en"
                  ? "Register"
                  : "Vazhdoni"}
              </BlueButton>

              <span className="register-privacy-policy">
                {currentLanguage === "en"
                  ? "By creating an account, you agree"
                  : " Duke krijuar një llogari, ju pranoni"}{" "}
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

export default Business;






