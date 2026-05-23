import React, { ChangeEvent, useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./ServicesWork.scss";
import back from "../../../assets/svg/backArrow.svg";
import drejtimFellne from "../../../assets/images/drejtimFellne.jpeg";
import montim from "../../../assets/images/montim.jpeg";
import ngjyrosje from "../../../assets/images/ngjyrosje.jpeg";
import hotel from "../../../assets/images/hotel.jpeg";
// import FormInput from "../../../components/FormInput/FormInput";
import BlueButton from "../../../components/BlueButton/BlueButton";
import upload from "../../../assets/svg/upload.svg";
import ServiceSelect from "../../../components/ServiceSelect/ServiceSelect";
import ServiceSearchSelect from "../../../components/ServiceSearchSelect/ServiceSearchSelect";
import ServiceDatePicker from "../../../components/ServiceDatePicker/ServiceDatePicker";
import useFetchData, { getServices } from "../../../services/api";
import getFirstWordLowercase from "../../../utils/LowerCaseFirstWord";
import { useNavigate } from "react-router-dom";
import WhiteLoader from "../../../components/WhiteLoader";
import { useAuth } from "../../../context/AuthContext";
import ServiceTimePicker from "../../../components/ServiceTimePicker/ServiceTimePicker";
import axiosInstance from "../../../services/axiosInstance";
import { useLanguage } from "../../../context/Language";
import Loader from "../../../components/Loader";

const ServicesWork = () => {
  const { data, isLoading } = useFetchData(getServices);
  const { currentUser } = useAuth();
  const { currentLanguage } = useLanguage();
  const [selectedService, setSelectedService] = useState<any>("drejtim");
  const [activeService, setActiveService] = useState<any>(" ");
  const [serviceDetails, setServiceDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState<any>({
    image: null,
    imagePreview: "", // <-- preview URL
    madhesia: "",
    ngjyra: "",
    ora: "",
    data: "",
    sezona: "",
    meFellne: false,
    sasia: 0,
    serviceId: "",
    businessId: "",
    cmimi: "",
    userId: currentUser.id,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const serviceId = event.target.id;
    const serviceName = event.target.value;

    setSelectedService(serviceName);
    setActiveService(serviceId);
    setForm((prev: any) => ({
      ...prev,
      serviceId: serviceId,
      cmimi: (prev?.cmimi ?? ""), // keep existing unless you map prices elsewhere
    }));
    fetchServiceDetails(serviceId);
  };

  const fetchServiceDetails = async (serviceId: any) => {
    try {
      const response = await axiosInstance.get(`/services/${serviceId}`);
      setServiceDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch service details:", error);
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedService(getFirstWordLowercase(data[0].name));
      setForm((prev: any) => ({
        ...prev,
        serviceId: data[0].id,
        userId: currentUser.id,
        cmimi: data[0].price,
      }));
      fetchServiceDetails(data[0].id);
    }
  }, [data, currentUser]);

  useEffect(() => {
    if (activeService) {
      fetchServiceDetails(activeService);
    }
  }, [activeService]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    fileKey: keyof any
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      // Revoke old preview if exists
      if (form.imagePreview) {
        URL.revokeObjectURL(form.imagePreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setForm((prev: any) => ({
        ...prev,
        [fileKey]: file,
        imagePreview: previewUrl,
      }));
    }
  };

  // Revoke preview URL on unmount or when preview changes (cleanup previous value)
  useEffect(() => {
    return () => {
      if (form.imagePreview) {
        URL.revokeObjectURL(form.imagePreview);
      }
    };
  }, [form.imagePreview]);

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setForm((prevForm: any) => ({
      ...prevForm,
      madhesia: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData: any = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "imagePreview") return; // Do not send preview URL
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });

    // Debug: log what gets appended
    for (let pair of formData.entries()) {
      console.log(`FormData => ${pair[0]}:`, pair[1]);
    }

    try {
      await axiosInstance.post("/service-orders", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/services/success");
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
    setLoading(false);
  };

  return (
    <>
      <Loader isLoading={isLoading} />

      <Header />
      <div className="services-booking">
        <aside className="service-menu">
          <h3>{currentLanguage === "en" ? "Services" : "Shërbimet"}</h3>
          <div className="service-menu-selection">
            {data?.map((data: any, index: any) => (
              <label key={index}>
                <input
                  type="radio"
                  name="service"
                  value={getFirstWordLowercase(data?.name)}
                  id={data?.id}
                  checked={
                    selectedService === getFirstWordLowercase(data?.name)
                  }
                  onChange={handleChange}
                />
                {data?.name}
              </label>
            ))}
          </div>
        </aside>

        <div className="booking-form">
          {selectedService === "drejtim" && (
            <FormDrejtim
              handleDateChange={handleDateChange}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
              handleSubmit={handleSubmit}
              form={form}
              data={serviceDetails}
              loading={loading}
              currentLanguage={currentLanguage}
            />
          )}
          {selectedService === "ngjyrosje" && (
            <FormNgjyrosje
              handleDateChange={handleDateChange}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
              handleSubmit={handleSubmit}
              form={form}
              data={serviceDetails}
              loading={loading}
              currentLanguage={currentLanguage}
            />
          )}
          {selectedService === "montim" && (
            <FormMontim
              handleDateChange={handleDateChange}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
              handleSubmit={handleSubmit}
              handleRadioChange={handleRadioChange}
              form={form}
              data={serviceDetails}
              currentLanguage={currentLanguage}
              loading={loading}
            />
          )}
          {selectedService === "hotel" && (
            <FormHotel
              handleDateChange={handleDateChange}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
              handleSubmit={handleSubmit}
              form={form}
              data={serviceDetails}
              currentLanguage={currentLanguage}
              loading={loading}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

const FormDrejtim = ({
  handleDateChange,
  handleInputChange,
  handleFileChange,
  handleSubmit,
  form,
  data,
  loading,
  currentLanguage,
}: {
  handleDateChange: any;
  handleSubmit: any;
  handleInputChange: (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => void;
  handleFileChange: (
    event: ChangeEvent<HTMLInputElement>,
    fileKey: keyof any
  ) => void;
  form: any;
  data: any;
  loading: any;
  currentLanguage: string;
}) => {
  return (
    <div className="service-booking-wrapper">
      <a href="/services">
        <img src={back} alt="Back arrow" className="backArrow" />
      </a>
      <div className="service-booking-form-section">
        <form className="service-booking-form" onSubmit={handleSubmit}>
          <div className="service-booking-form-top">
            <h3>
              {currentLanguage === "en"
                ? "Wheel alignment"
                : "Drejtim të fellneve"}
            </h3>
            <div className="service-booking-form-inputs">
              <div className="service-booking-form-inputs-left">
                <div className="fileInputContainer">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(event) => handleFileChange(event, "image")}
                  />
                  <label htmlFor="image" className="customFileInput">
                    {form.imagePreview ? (
                      <img
                        src={form.imagePreview}
                        alt="Preview"
                        className="uploaded-preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: 160,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      <>
                        <p>
                          {currentLanguage === "en"
                            ? "Upload an image"
                            : "Ngarko një foto"}
                        </p>
                        <img src={upload} alt="" className="customFIleInputImage" />
                      </>
                    )}
                  </label>
                </div>
              </div>
              <div className="service-booking-form-inputs-right">
                <ServiceSelect
                  label={currentLanguage === "en" ? "Size:" : "Madhësia:"}
                  value={form.serviceSize}
                  handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleDateChange("madhesia", e.target.value)
                  }
                  options={[
                    { value: "15", label: '15"' },
                    { value: "16", label: '16"' },
                    { value: "17", label: '17"' },
                    { value: "18", label: '18"' },
                  ]}
                />

                <ServiceTimePicker
                  label={currentLanguage === "en" ? "Time" : "Ora"}
                  handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleDateChange("ora", e.target.value)
                  }
                />
                <ServiceDatePicker
                  label={currentLanguage === "en" ? "Date" : "Data"}
                  value={form.serviceDate}
                  handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleDateChange("data", e.target.value)
                  }
                />
                {data ? (
                  <ServiceSearchSelect
                    label={
                      currentLanguage === "en" ? "Company: " : "Kompania: "
                    }
                    onChange={(value: string) =>
                      handleDateChange("businessId", value)
                    }
                    options={data?.providers?.map((provider: any) => ({
                      value: provider.id,
                      label: provider.specialFields.companyName,
                    }))}
                  />
                ) : null}
              </div>
            </div>
          </div>
          <div className="service-booking-form-bottom">
            <div className="service-booking-form-bottom-header">
              <h4>
                {currentLanguage === "en" ? "Price" : "Çmimi"}:{" "}
                <span>{data?.price}€</span>
              </h4>
              <p>
                {currentLanguage === "en"
                  ? "Note: The starting price may vary depending on the condition of the tire."
                  : "Shënim: Çmimi fillestar mund të ndryshojë nga gjendja e gomës."}
              </p>
            </div>
            <div className="service-booking-form-bottom-confirm">
              <BlueButton type="submit">
                {" "}
                {loading ? (
                  <WhiteLoader />
                ) : currentLanguage === "en" ? (
                  "Set a Date"
                ) : (
                  "Cakto Termin"
                )}
              </BlueButton>
              <p>
                {currentLanguage === "en"
                  ? "Note: Payment will be made after the service is completed!"
                  : "Shënim: Pagesa do të bëhet pas përfundimit të shërbimit!"}
              </p>
            </div>
          </div>
        </form>
        <img src={drejtimFellne} alt="drejtimFellne" className="form-image" />
      </div>
    </div>
  );
};

const FormNgjyrosje = ({
  handleDateChange,
  handleInputChange,
  handleFileChange,
  handleSubmit,
  form,
  data,
  currentLanguage,
  loading,
}: {
  handleDateChange: any;
  handleSubmit: any;
  handleInputChange: (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => void;
  handleFileChange: (
    event: ChangeEvent<HTMLInputElement>,
    fileKey: keyof any
  ) => void;
  form: any;
  data: any;
  loading: any;
  currentLanguage: string;
}) => (
  <div className="service-booking-wrapper">
    <a href="/services">
      <img src={back} alt="backArrow" className="backArrow" />
    </a>
    <div className="service-booking-form-section">
      <form className="service-booking-form" onSubmit={handleSubmit}>
        <div className="service-booking-form-top">
          <h3>
            {currentLanguage === "en"
              ? "Rim painting"
              : "Ngjyrosje të fellneve"}
          </h3>
          <div className="service-booking-form-inputs">
            <div className="service-booking-form-inputs-left">
              <div className="fileInputContainer">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(event) => handleFileChange(event, "image")}
                />
                <label htmlFor="image" className="customFileInput">
                  {form.imagePreview ? (
                    <img
                      src={form.imagePreview}
                      alt="Preview"
                      className="uploaded-preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 160,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  ) : (
                    <>
                      <p>
                        {currentLanguage === "en"
                          ? "Upload an image"
                          : "Ngarko një foto"}
                      </p>
                      <img src={upload} alt="" className="customFIleInputImage" />
                    </>
                  )}
                </label>
              </div>
            </div>
            <div className="service-booking-form-inputs-right">
              <ServiceSelect
                label={currentLanguage === "en" ? "Size:" : "Madhësia:"}
                value={form.serviceSize}
                handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleDateChange("madhesia", e.target.value)
                }
                options={[
                  { value: "15", label: '15"' },
                  { value: "16", label: '16"' },
                  { value: "17", label: '17"' },
                  { value: "18", label: '18"' },
                ]}
              />
              <ServiceSelect
                label={currentLanguage === "en" ? "Color" : "Ngjyra"}
                value={form.serviceSize}
                handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleDateChange("ngjyra", e.target.value)
                }
                options={[
                  { value: "Black", label: 'Black"' },
                  { value: "White", label: 'White"' },
                  { value: "Red", label: 'Red"' },
                  { value: "Blue", label: 'Blue"' },
                ]}
              />
              <ServiceDatePicker
                label={currentLanguage === "en" ? "Date" : "Data"}
                value={form.serviceDate}
                handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleDateChange("data", e.target.value)
                }
              />
              <ServiceTimePicker
                label={currentLanguage === "en" ? "Time" : "Ora"}
                handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleDateChange("ora", e.target.value)
                }
              />

              {data ? (
                <ServiceSearchSelect
                  label={currentLanguage === "en" ? "Company:" : "Kompania:"}
                  onChange={(value: string) =>
                    handleDateChange("businessId", value)
                  }
                  options={data?.providers?.map((provider: any) => ({
                    value: provider.id,
                    label: provider.specialFields.companyName,
                  }))}
                />
              ) : null}
            </div>
          </div>
        </div>
        <div className="service-booking-form-bottom">
          <div className="service-booking-form-bottom-header">
            <h4>
              {currentLanguage === "en" ? "Price" : "Çmimi"}:{" "}
              <span>{data?.price}€</span>
            </h4>
            <p>
              {currentLanguage === "en"
                ? "Note: The starting price may vary depending on the condition of the tire."
                : " Shënim: Çmimi fillestar mund të ndryshojë nga gjendja e gomës."}
            </p>
          </div>
          <div className="service-booking-form-bottom-confirm">
            <BlueButton type="submit">
              {" "}
              {loading ? (
                <WhiteLoader />
              ) : currentLanguage === "en" ? (
                "Set a Date"
              ) : (
                "Cakto Termin"
              )}
            </BlueButton>
            <p>
              {currentLanguage === "en"
                ? "Note: Payment will be made after the service is completed!"
                : "Shënim: Pagesa do të bëhet pas përfundimit të shërbimit!"}
            </p>
          </div>
        </div>
      </form>
      <img src={ngjyrosje} alt="drejtimFellne" className="form-image" />
    </div>
  </div>
);

const FormMontim = ({
  handleDateChange,
  handleInputChange,
  handleFileChange,
  handleSubmit,
  handleRadioChange,
  form,
  data,
  loading,
  currentLanguage,
}: {
  handleDateChange: any;
  handleSubmit: any;
  handleInputChange: (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => void;
  handleFileChange: (
    event: ChangeEvent<HTMLInputElement>,
    fileKey: keyof any
  ) => void;
  handleRadioChange: any;
  form: any;
  data: any;
  loading: any;
  currentLanguage: string;
}) => (
  <div className="service-booking-wrapper">
    <a href="/services">
      <img src={back} alt="backArrow" className="backArrow" />
    </a>
    <div className="service-booking-form-section">
      <form className="service-booking-form" onSubmit={handleSubmit}>
        <div className="service-booking-form-top">
          <h3>Montim + Balancim</h3>
          <div className="service-booking-form-inputs">
            <div className="service-booking-form-inputs-left-radio">
              {/* Assuming independent selections for left and right */}
              <label>
                <input
                  type="radio"
                  name="sizeLeft"
                  value="R17"
                  onChange={handleRadioChange}
                />
                R17: 5€
              </label>
              <label>
                <input
                  type="radio"
                  name="sizeLeft"
                  value="R18"
                  onChange={handleRadioChange}
                />
                R18: 10€
              </label>
              <label>
                <input
                  type="radio"
                  name="sizeLeft"
                  value="R19"
                  onChange={handleRadioChange}
                />
                R19: 12€
              </label>
              <label>
                <input
                  type="radio"
                  name="sizeLeft"
                  value="R20"
                  onChange={handleRadioChange}
                />
                R20: 14€
              </label>
            </div>
            <div className="service-booking-form-inputs-right-radio">
              <ServiceDatePicker
                label="Data"
                value={form.serviceDate}
                handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleDateChange("data", e.target.value)
                }
              />
              <ServiceTimePicker
                label="Ora"
                handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleDateChange("ora", e.target.value)
                }
              />
              {data ? (
                <ServiceSearchSelect
                  label="Kompania:"
                  onChange={(value: string) =>
                    handleDateChange("businessId", value)
                  }
                  options={data?.providers?.map((provider: any) => ({
                    value: provider.id,
                    label: provider.specialFields.companyName,
                  }))}
                />
              ) : null}
            </div>
          </div>
        </div>
        <div className="service-booking-form-bottom">
          <div className="service-booking-form-bottom-confirm-center">
            <BlueButton type="submit">
              {loading ? <WhiteLoader /> : "Cakto Termin"}
            </BlueButton>
            <p>Shënim: Pagesa do të bëhet pas përfundimit të shërbimit!</p>
          </div>
        </div>
      </form>
      <img src={montim} alt="drejtimFellne" className="form-image" />
    </div>
  </div>
);

const FormHotel = ({
  handleDateChange,
  handleInputChange,
  handleFileChange,
  handleSubmit,
  form,
  data,
  loading,
  currentLanguage,
}: {
  handleDateChange: any;
  handleSubmit: any;
  handleInputChange: (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => void;
  handleFileChange: (
    event: ChangeEvent<HTMLInputElement>,
    fileKey: keyof any
  ) => void;
  form: any;
  data: any;
  loading: any;
  currentLanguage: string;
}) => (
  <div className="service-booking-wrapper">
    <a href="/services">
      <img src={back} alt="backArrow" className="backArrow" />
    </a>
    <div className="service-booking-form-section">
      <form className="service-booking-form" onSubmit={handleSubmit}>
        <div className="service-booking-form-top">
          <h3>Hotel i Gomave</h3>
          <div className="service-booking-form-inputs">
            <div className="service-booking-form-inputs-right">
              <ServiceSelect
                label="Madhësia:"
                value={form.serviceSize}
                handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleDateChange("madhesia", e.target.value)
                }
                options={[
                  { value: "15", label: '15"' },
                  { value: "16", label: '16"' },
                  { value: "17", label: '17"' },
                  { value: "18", label: '18"' },
                ]}
              />

              <ServiceSelect
                label="Sezona:"
                value={form.serviceSize}
                handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleDateChange("sezona", e.target.value)
                }
                options={[
                  { value: "verore", label: "Verore" },
                  { value: "dimerore", label: "Dimerore" },
                ]}
              />
              <ServiceSelect
                label="Fellne:"
                value={form.serviceSize}
                handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleDateChange("meFellne", e.target.value)
                }
                options={[
                  { value: true, label: "Me fellne" },
                  { value: false, label: "Pa fellne" },
                ]}
              />
              <ServiceSelect
                label="Sasia:"
                value={form.serviceSize}
                handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleDateChange("sasia", e.target.value)
                }
                options={[
                  { value: "2", label: "2" },
                  { value: "4", label: "4" },
                  { value: "6", label: "6" },
                  { value: "8", label: "8" },
                  { value: "10", label: "10" },
                ]}
              />

             {data ? (
                <ServiceSearchSelect
                  label={currentLanguage === "en" ? "Company:" : "Kompania:"}
                  onChange={(value: string) =>
                    handleDateChange("businessId", value)
                  }
                  options={data?.providers?.map((provider: any) => ({
                    value: provider.id,
                    label: provider.specialFields.companyName,
                  }))}
                />
              ) : null}
            </div>
          </div>
        </div>
        <div className="service-booking-form-bottom">
          <div className="service-booking-form-bottom-header">
            <h4>
              Çmimi: <span>{data?.price}€</span>
            </h4>
            <p>Note: Qmimi vlenë për vetëm 6 muaj.</p>
          </div>
          <div className="service-booking-form-bottom-confirm">
            <BlueButton type="submit">
              {loading ? <WhiteLoader /> : "Check in"}
            </BlueButton>
            <p>Shënim: Pagesa do të bëhet pas përfundimit të shërbimit!</p>
          </div>
        </div>
      </form>
      <img src={hotel} alt="drejtimFellne" className="form-image" />
    </div>
  </div>
);

export default ServicesWork;
