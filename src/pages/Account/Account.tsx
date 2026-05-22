import React, { useState, useEffect } from "react";
import "./Account.scss";
import Header from "../../components/Header/Header";
import AccountPageNav from "../../components/AccountPageNav/AccountPageNav";
import BlueButton from "../../components/BlueButton/BlueButton";
import OutlineButton from "../../components/OutlineButton/OutlineButton";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/Language";
import { countryData, cityData } from "../../data/locations";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import axios from "axios";

import FormInput from "../../components/FormInput/FormInput";
import CustomSelect from "../../components/FormSelect/FormSelect";
import PhoneNumberInput from "../../components/PhoneNumberInput/PhoneNumberInput";
import MapComponent from "../../components/MapComponent/MapComponent";

// ---------- SHARED TYPES ----------

interface Phone {
  phone: string;
  countryCode: string;
}

type WorkingHour = {
  day: string;
  openingHour: string;
  closingHour: string;
};

// ---------- CLIENT FORM TYPES / HELPERS ----------

interface ClientFormValues {
  fullName: string;
  email: string;
  country: string;
  city: string;
  address: string;
  password: string;
  phone: Phone;
}

const clientInitialFromUser = (user: any): ClientFormValues => {
  const storedPhone: string | undefined = user?.specialFields?.phone;
  const parsedPhone: Phone = (() => {
    if (!storedPhone) return { countryCode: "+383", phone: "" };
    if (!storedPhone.startsWith("+")) {
      return { countryCode: "+383", phone: storedPhone.replace(/\D/g, "") };
    }
    const match = storedPhone.match(/^(\+\d{3})(\d+)$/);
    if (match) {
      return { countryCode: match[1], phone: match[2] };
    }
    return { countryCode: "+383", phone: storedPhone.replace(/\D/g, "") };
  })();

  return {
    fullName: user?.specialFields?.fullName || "",
    email: user?.email || "",
    country: user?.specialFields?.country || "",
    city: user?.specialFields?.city || "",
    address: user?.specialFields?.address || user?.address || "",
    password: "",
    phone: parsedPhone,
  };
};

const clientValidationSchema = Yup.object({
  fullName: Yup.string().required("Please provide the required field."),
  email: Yup.string()
    .email("Invalid email address")
    .required("Please provide the required field."),
  country: Yup.string().required("Please provide the required field."),
  city: Yup.string().required("Please provide the required field."),
  address: Yup.string().required("Please provide the required field."),
  password: Yup.string(), // optional for update; required on register only
  phone: Yup.object({
    phone: Yup.string()
      .matches(/^\d+$/, "Phone number is not valid")
      .required("Please provide the required field."),
    countryCode: Yup.string().required("Please provide the required field."),
  }).required("Please provide the required field."),
});

const ClientAccountForm: React.FC<{
  currentUser: any;
  onCancel: () => void;
}> = ({ currentUser, onCancel }) => {
  const { currentLanguage } = useLanguage();
  const { updateUser } = useAuth();
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const initial = clientInitialFromUser(currentUser);
    if (initial.country) {
      setCities(cityData[initial.country] || []);
    }
  }, [currentUser]);

  const handleCountryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    const selectedCountry = event.target.value;
    setFieldValue("country", selectedCountry);
    setCities(cityData[selectedCountry] || []);
    setFieldValue("city", "");
  };

  const handleSubmit = async (
    values: ClientFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    const {
      fullName,
      email,
      address,
      password,
      country,
      city,
      phone,
      ...rest
    } = values;

    const payload: any = {
      email,
      specialFields: {
        fullName,
        address,
        country,
        city,
        phone: `${phone.countryCode}${phone.phone}`,
        ...rest,
      },
    };

    if (password) {
      payload.password = password;
    }

    try {
      await updateUser(payload);
      setSubmitting(false);
      alert(
        currentLanguage === "en"
          ? "Account updated successfully!"
          : "Llogaria u përditësua me sukses!"
      );
      onCancel();
    } catch (err) {
      console.error("Failed to update client account:", err);
      setSubmitting(false);
    }
  };

  const initialValues = clientInitialFromUser(currentUser);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={clientValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, setFieldValue, values, errors, touched }) => (
        <Form className="account-update-form">
          <FormInput
            placeholder={
              currentLanguage === "en" ? "Full Name" : "Emri i Plotë"
            }
            name="fullName"
            type="text"
            error={errors.fullName}
            touched={touched.fullName}
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

          {/* Country / City */}
          <div className="business-selections-account">
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
                  currentLanguage === "en" ? "Select City" : "Zgjidhni qytetin"
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

          {/* Phone */}
          <Field name="phone">
            {({ field, form }: any) => (
              <PhoneNumberInput
                value={field.value}
                onChange={(value: any) => form.setFieldValue("phone", value)}
                error={errors.phone && (errors.phone as any).phone}
                touched={touched.phone && (touched.phone as any).phone}
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
            placeholder={
              currentLanguage === "en" ? "New Password" : "Fjalëkalim i ri"
            }
            name="password"
            type="password"
            autoComplete="new-password"
            error={errors.password}
            touched={touched.password}
          />

          <div className="account-update-buttons">
            <BlueButton type="submit" disabled={isSubmitting}>
              {currentLanguage === "en" ? "Save Changes" : "Ruaj Ndryshimet"}
            </BlueButton>
            <OutlineButton type="button" onClick={onCancel}>
              {currentLanguage === "en" ? "Cancel" : "Anulo"}
            </OutlineButton>
          </div>
        </Form>
      )}
    </Formik>
  );
};

// ---------- BUSINESS FORM TYPES / HELPERS ----------

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
  specialFields?: any;
}

const normalizeWorkingHours = (raw: any): WorkingHour[] => {
  const base: WorkingHour[] = [
    { day: "Monday", openingHour: "", closingHour: "" },
    { day: "Tuesday", openingHour: "", closingHour: "" },
    { day: "Wednesday", openingHour: "", closingHour: "" },
    { day: "Thursday", openingHour: "", closingHour: "" },
    { day: "Friday", openingHour: "", closingHour: "" },
    { day: "Saturday", openingHour: "", closingHour: "" },
    { day: "Sunday", openingHour: "", closingHour: "" },
  ];

  if (!Array.isArray(raw)) return base;

  return base.map((d) => {
    const match = raw.find((x: any) => x.day === d.day);
    if (!match) return d;
    const opening =
      match.openingHour && match.openingHour.toLowerCase() !== "closed"
        ? match.openingHour
        : "";
    const closing =
      match.closingHour && match.closingHour.toLowerCase() !== "closed"
        ? match.closingHour
        : "";
    return { day: d.day, openingHour: opening, closingHour: closing };
  });
};

const businessInitialFromUser = (user: any): BusinessFormValues => {
  const storedPhone: string | undefined = user?.specialFields?.phone;
  const parsedPhone: Phone = (() => {
    if (!storedPhone) return { countryCode: "+383", phone: "" };
    if (!storedPhone.startsWith("+")) {
      return { countryCode: "+383", phone: storedPhone.replace(/\D/g, "") };
    }
    const match = storedPhone.match(/^(\+\d{3})(\d+)$/);
    if (match) {
      return { countryCode: match[1], phone: match[2] };
    }
    return { countryCode: "+383", phone: storedPhone.replace(/\D/g, "") };
  })();

  return {
    companyName: user?.specialFields?.companyName || "",
    email: user?.email || "",
    country: user?.specialFields?.country || "",
    city: user?.specialFields?.city || "",
    password: "",
    phone: parsedPhone,
    address: user?.specialFields?.address || user?.address || "",
    nrARBK: user?.specialFields?.nrARBK || "",
    businessType: user?.specialFields?.businessType || "Autosallon",
    roadAssistance: user?.specialFields?.roadAssistance || "",
    alwaysAvailable: user?.specialFields?.alwaysAvailable || false,
    workingHours: normalizeWorkingHours(user?.specialFields?.workingHours),
    services: user?.specialFields?.services || [],
    latitude:
      typeof user?.specialFields?.latitude === "number"
        ? user.specialFields.latitude
        : null,
    longitude:
      typeof user?.specialFields?.longitude === "number"
        ? user.specialFields.longitude
        : null,
    specialFields: user?.specialFields,
  };
};

const businessValidationSchema = Yup.object({
  companyName: Yup.string().required("Please provide the company name."),
  email: Yup.string()
    .email("Invalid email address")
    .required("Please provide an email address."),
  country: Yup.string().required("Please provide the required field."),
  city: Yup.string().required("Please provide the required field."),
  password: Yup.string(), // optional on update
  phone: Yup.object({
    phone: Yup.string()
      .matches(/^\d+$/, "Phone number is not valid")
      .required("Please provide the required field."),
    countryCode: Yup.string().required("Please provide the required field."),
  }).required("Please provide the required field."),
  address: Yup.string().required("Please provide the required field."),
  nrARBK: Yup.string().required("Please provide the required field."),
  businessType: Yup.string().required("Please provide the required field."),
  roadAssistance: Yup.string().when("businessType", {
    is: "Karrotrec",
    then: (schema) => schema.required("Please select road assistance option."),
    otherwise: (schema) => schema.nullable(),
  }),
  workingHours: Yup.array().when(["businessType", "roadAssistance"], {
    is: (businessType: any, roadAssistance: any) =>
      businessType === "Karrotrec" && roadAssistance === "Po",
    then: (schema) => schema.min(1, "Please select at least one working hour."),
    otherwise: (schema) => schema.nullable(),
  }),
});

const dayTranslations: Record<string, string> = {
  Monday: "E Hënë",
  Tuesday: "E Martë",
  Wednesday: "E Mërkurë",
  Thursday: "E Enjte",
  Friday: "E Premte",
  Saturday: "E Shtunë",
  Sunday: "E Diel",
};

const BusinessAccountForm: React.FC<{
  currentUser: any;
  onCancel: () => void;
}> = ({ currentUser, onCancel }) => {
  const { currentLanguage } = useLanguage();
  const { updateUser } = useAuth();

  const [cities, setCities] = useState<string[]>([]);
  const [servicesOptions, setServicesOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [businessTypeOptions, setBusinessTypeOptions] = useState<string[]>([]);

  const initialValues = businessInitialFromUser(currentUser);

  useEffect(() => {
    if (initialValues.country) {
      setCities(cityData[initialValues.country] || []);
    }
  }, [currentUser]); // eslint-disable-line

  // Fetch services
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
        setServicesOptions(serviceOptions);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };
    fetchServices();
  }, []);

  // Fetch business types
  useEffect(() => {
    const fetchBusinessTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://gomisteria-api.onrender.com/api/business-types",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

  const handleSubmit = async (
    values: BusinessFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
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

    const specialFields: any = {
      nrARBK,
      businessType,
      companyName,
      country,
      city,
      phone: `${phone.countryCode}${phone.phone}`,
      address,
      ...rest,
      services,
      latitude,
      longitude,
    };

    if (
      (businessType === "Karrotrec" || businessType === "Gomisteri") &&
      roadAssistance === "Po"
    ) {
      specialFields.roadAssistance = roadAssistance;
      specialFields.alwaysAvailable = alwaysAvailable;
      specialFields.workingHours = alwaysAvailable
        ? undefined
        : formattedWorkingHours;
    } else {
      specialFields.roadAssistance =
        businessType === "Karrotrec" || businessType === "Gomisteri"
          ? roadAssistance
          : undefined;
      specialFields.alwaysAvailable = undefined;
      specialFields.workingHours = undefined;
    }

    const payload: any = {
      email,
      specialFields,
    };

    if (password) {
      payload.password = password;
    }

    try {
      await updateUser(payload);
      setSubmitting(false);
      alert(
        currentLanguage === "en"
          ? "Account updated successfully!"
          : "Llogaria u përditësua me sukses!"
      );
      onCancel();
    } catch (error) {
      console.error("Failed to update business:", error);
      setSubmitting(false);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={businessValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, setFieldValue, values, errors, touched }) => (
        <Form className="account-update-form">
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
              value={values?.specialFields?.businessType}
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
                  <div className="error-message">{errors.roadAssistance}</div>
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

                    {!values.alwaysAvailable && values.workingHours && values.workingHours.length > 0 ? (
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
                                const updatedHours = values.workingHours.map(
                                  (d, i) =>
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
                                const updatedHours = values.workingHours.map(
                                  (d, i) =>
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
                        No working hours available.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <FormInput
            placeholder={currentLanguage === "en" ? "UNIQUE No." : "Nr. UNIK"}
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

          {/* Phone */}
          <Field name="phone">
            {({ field, form }: any) => (
              <PhoneNumberInput
                value={field.value}
                onChange={(value: any) => form.setFieldValue("phone", value)}
                error={errors.phone && (errors.phone as any).phone}
                touched={touched.phone && (touched.phone as any).phone}
              />
            )}
          </Field>

          {/* Country / City */}
          <div className="business-selections-account">
            <div className="selection">
              <CustomSelect
                data={countryData}
                title="Selekto Shtetin"
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
                title="Selekto Qytetin"
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
              currentLanguage === "en" ? "New Password" : "Fjalëkalim i ri"
            }
            name="password"
            type="password"
            error={errors.password}
            touched={touched.password}
          />

          {/* Services for Gomisteri */}
          {values.businessType !== "Gomisteri" ? null : (
            <>
              <Select
                options={servicesOptions}
                isMulti
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder={
                  currentLanguage === "en"
                    ? "Select Services"
                    : "Selekto Shërbime"
                }
                value={servicesOptions.filter((service) =>
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
                <div className="error-message">{errors.services as any}</div>
              )}
            </>
          )}

          <h3>
            {currentLanguage === "en"
              ? "Select Business Location"
              : "Selekto lokacionin të biznesit"}
          </h3>
          <MapComponent
            onLocationSelected={(location: { lat: number; lng: number }) => {
              setFieldValue("latitude", location.lat);
              setFieldValue("longitude", location.lng);
            }}
          />

          <div className="account-update-buttons">
            <BlueButton type="submit" disabled={isSubmitting}>
              {currentLanguage === "en" ? "Save Changes" : "Ruaj Ndryshimet"}
            </BlueButton>
            <OutlineButton type="button" onClick={onCancel}>
              {currentLanguage === "en" ? "Cancel" : "Anulo"}
            </OutlineButton>
          </div>
        </Form>
      )}
    </Formik>
  );
};

// ---------- MAIN ACCOUNT COMPONENT ----------

const Account: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const isBusiness = currentUser?.role === "business";
  const isClient = currentUser?.role === "client";

  const toggleEdit = () => setIsEditing((prev) => !prev);

  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <Header />
      <div className="account-wrapper">
        <AccountPageNav />
        <div className="account-information">
          <h2>
            {currentLanguage === "en"
              ? "Account Information"
              : "Informacionet e llogarisë"}
          </h2>
          <div className="account-details-wrapper">
            {!isEditing ? (
              <div className="account-details">
                {/* COMMON / CLIENT INFO */}
                {currentUser?.specialFields?.fullName && (
                  <div className="account-field">
                    <h6>
                      {currentLanguage === "en" ? "Full Name" : "Emri i plotë"}
                    </h6>
                    <p>{currentUser?.specialFields?.fullName}</p>
                  </div>
                )}

                <div className="account-field">
                  <h6>Email</h6>
                  <p>{currentUser?.email}</p>
                </div>

                <div className="account-field">
                  <h6>{currentLanguage === "en" ? "Phone" : "Telefoni"}</h6>
                  <p>{currentUser?.specialFields?.phone}</p>
                </div>

                {currentUser?.specialFields?.address && (
                  <div className="account-field">
                    <h6>{currentLanguage === "en" ? "Address" : "Adresa"}</h6>
                    <p>{currentUser?.specialFields?.address}</p>
                  </div>
                )}

                {currentUser?.specialFields?.city && (
                  <div className="account-field">
                    <h6>{currentLanguage === "en" ? "City" : "Qyteti"}</h6>
                    <p>{currentUser?.specialFields?.city}</p>
                  </div>
                )}

                {currentUser?.specialFields?.country && (
                  <div className="account-field">
                    <h6>{currentLanguage === "en" ? "Country" : "Shteti"}</h6>
                    <p>{currentUser?.specialFields?.country}</p>
                  </div>
                )}

                {/* BUSINESS INFO */}
                {isBusiness && (
                  <>
                    {currentUser?.specialFields?.companyName && (
                      <div className="account-field">
                        <h6>
                          {currentLanguage === "en"
                            ? "Company Name"
                            : "Emri i kompanisë"}
                        </h6>
                        <p>{currentUser?.specialFields?.companyName}</p>
                      </div>
                    )}

                    {currentUser?.specialFields?.businessType && (
                      <div className="account-field">
                        <h6>
                          {currentLanguage === "en"
                            ? "Business Type"
                            : "Lloji i biznesit"}
                        </h6>
                        <p>{currentUser?.specialFields?.businessType}</p>
                      </div>
                    )}

                    {currentUser?.specialFields?.nrARBK && (
                      <div className="account-field">
                        <h6>ARBK Nr.</h6>
                        <p>{currentUser?.specialFields?.nrARBK}</p>
                      </div>
                    )}

                    {currentUser?.specialFields?.roadAssistance && (
                      <div className="account-field">
                        <h6>
                          {currentLanguage === "en"
                            ? "Road Assistance"
                            : "Ndihmë rrugore"}
                        </h6>
                        <p>
                          {currentUser?.specialFields?.roadAssistance}
                          {currentUser?.specialFields?.alwaysAvailable && " (24/7)"}
                        </p>
                      </div>
                    )}

                    {(currentUser?.specialFields?.latitude ||
                      currentUser?.specialFields?.longitude) && (
                      <div className="account-field">
                        <h6>Coordinates</h6>
                        <p>
                          {currentUser?.specialFields?.latitude},{" "}
                          {currentUser?.specialFields?.longitude}
                        </p>
                      </div>
                    )}

                    {Array.isArray(
                      currentUser?.specialFields?.workingHours
                    ) && (
                      <div className="account-field">
                        <h6>
                          {currentLanguage === "en"
                            ? "Working Hours"
                            : "Orari i punës"}
                        </h6>
                        <ul>
                          {currentUser.specialFields.workingHours.map(
                            (wh: any) => (
                              <li key={wh.day}>
                                {wh.day}: {wh.openingHour} - {wh.closingHour}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                <BlueButton onClick={toggleEdit}>
                  {currentLanguage === "en"
                    ? "Change Information"
                    : "Ndrysho informatat"}
                </BlueButton>
              </div>
            ) : (
              <div className="account-update-form-wrapper">
                {isClient && (
                  <ClientAccountForm
                    currentUser={currentUser}
                    onCancel={() => setIsEditing(false)}
                  />
                )}
                {isBusiness && (
                  <BusinessAccountForm
                    currentUser={currentUser}
                    onCancel={() => setIsEditing(false)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;

