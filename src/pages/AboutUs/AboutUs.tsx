import React from "react";
import "./AboutUs.scss";
import Footer from "../../components/Footer/Footer";
import aboutImage from "../../assets/images/aboutImage.png";
import Header from "../../components/Header/Header";
import { useLanguage } from "../../context/Language";
const AboutUs = () => {
  const {currentLanguage} = useLanguage()
  return (
    <>
    <Header />
      <div className="aboutWrapper">
        <div className="about-text">
          <h1>{currentLanguage === "en" ? "About us" : "Rreth nesh"}</h1>
          <p>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less content of a page
            when looking at its layout. The point of using Lorem Ipsum is that
            it has a more-or-less normal distribution of letters, as opposed to
            using 'Content here, content here', making it look like readable
            English. Many desktop publishing packages and web page editors now
            use Lorem Ipsum as their default model text, and a search.
          </p>
        </div>
        <img src={aboutImage} alt="" />
        <div className="about-text">
          <p>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less content of a page
            when looking at its layout. The point of using Lorem Ipsum is that
            it has a more-or-less normal distribution of letters, as opposed to
            using 'Content here, content here', making it look like readable
            English. Many desktop publishing packages and web page editors now
            use Lorem Ipsum as their default model text, and a search.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
