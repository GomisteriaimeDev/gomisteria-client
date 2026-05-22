import React, { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Marquee from "react-fast-marquee";
import useFetchData, { getHomepageCms, getProData } from "../../services/api";

import "./HomePage.scss";
import Header from "../../components/Header/Header";
import ProductItemPRO from "../../components/ProductItemPRO/ProductItemPRO";
import Footer from "../../components/Footer/Footer";
import { useLanguage } from "../../context/Language";

const HomePage = () => {
  const { currentLanguage } = useLanguage();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const { data } = useFetchData(getHomepageCms);

  const [products, setProducts] = useState<any>({});
  const [meta, setMeta] = useState<any>({});
  const { data: productsResponse, isLoading: isLoadingProducts } = useFetchData(
    getProData,
    6,
    1,
  );

  useEffect(() => {
    setProducts(productsResponse?.data);
    setMeta(productsResponse?.meta);
  }, [productsResponse]);
  // Pagination function

  return (
    <>
      {/* <div className="maintenanceOverlay">
        <div className="maintenanceContent">
          <h2>Gomisteriaime.com</h2>
          <p>
            Gomisteriaime.com aktualisht është duke u zhvilluar nga programerët
            tanë dhe për momentin është e padisponueshme. Sapo të përfundojë
            puna, ju do të njoftoheni përmes një SMS-je, dhe më pas mund të
            vazhdoni normalisht me porositë online.
          </p>
          <p>Faleminderit për mirëkuptimin!</p>
        </div>
      </div> */}
      <Header />
      <div className="heroSection">
        <Swiper
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper: any) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          modules={[Navigation, Autoplay]}
          className="heroSlider"
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          speed={3000}
        >
          {data?.hero?.slides?.map((item: any, index: any) => (
            <SwiperSlide key={index}>
              <a href={item?.href} target="_blank" rel="noreferrer">
                <img className="slideImage" src={item?.imageUrl} alt="" />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="marqueeControls">
          <Marquee autoFill className="brandsMarquee">
            {data?.brands?.map((item: any, index: any) => (
              <SwiperSlide key={index}>
                <a href={item?.href} target="_blank" rel="noreferrer">
                  <img src={item?.imageUrl} alt={item?.name} />
                </a>
              </SwiperSlide>
            ))}
          </Marquee>

          {data?.hero?.slides.length > 1 && (
            <div className="navigationButtons">
              <div className="navButton" ref={prevRef}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="54"
                  height="54"
                  viewBox="0 0 54 54"
                  fill="none"
                >
                  <path
                    d="M35.1006 26.9999L18.9006 26.9999M18.9006 26.9999L27.0006 18.8999M18.9006 26.9999L27.0006 35.0999"
                    stroke="#020F15"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="navButton" ref={nextRef}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="54"
                  height="54"
                  viewBox="0 0 54 54"
                  fill="none"
                >
                  <path
                    d="M18.8994 26.9999L35.0994 26.9999M35.0994 26.9999L26.9994 18.8999M35.0994 26.9999L26.9994 35.0999"
                    stroke="#020F15"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="homeProducts">
        {data?.categoryCards?.map((item: any, index: any) => (
          <a
            href={item?.href}
            className="homeProductBox"
            key={index}
            target="_blank"
            rel="noreferrer"
          >
            <img src={item?.imageUrl} alt="tire" />
            <div className="homeProductText">
              <h4>{item?.title}</h4>
              <p>{item?.subtitle}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="homepage-products">
        {isLoadingProducts ? null : products?.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div>
            <div className="home-products-section">
              {products?.map(
                (product: any, index: any) => (
                  console.log(products),
                  (<ProductItemPRO key={index} productData={product} />)
                ),
              )}
            </div>
            {/* <PaginationHome meta={meta} onPageChange={paginate} /> */}
          </div>
        )}
      </div>
      <div className="offerImages">
        <a href={data?.promos?.left?.href} target="_blank" rel="noreferrer">
          <img
            src={data?.promos?.left?.imageUrl}
            alt={data?.promos?.left?.alt}
          />
        </a>
        <a href={data?.promos?.right?.href} target="_blank" rel="noreferrer">
          <img
            src={data?.promos?.right?.imageUrl}
            alt={data?.promos?.right?.alt}
          />
        </a>
      </div>
      <div className="reviewsContainer">
        {/* Heading */}
        <div className="reviewsHeader">
          <h2>
            {currentLanguage === "en"
              ? "Reviews from our clients "
              : "Reviews nga klientat tanë"}
          </h2>
        </div>

        {/* Gradient Overlays */}
        <div className="marqueeArea">
          <div className="gradientOverlayLeft"></div>
          <div className="gradientOverlayRight"></div>

          <div className="marqueeWrapper">
            {/* First Marquee - Direction Right */}
            <Marquee
              direction="right"
              loop={0}
              autoFill
              className="customMarquee"
            >
              {data?.reviews?.items
                ?.sort(() => Math.random() - 0.5) // Shuffle items randomly
                .map((item: any, index: any) => (
                  <ReviewCard
                    key={index}
                    text={item.text}
                    author={item.name}
                    image={item.avatarUrl}
                    stars={item.rating}
                  />
                ))}
            </Marquee>

            {/* Second Marquee - Direction Left */}
            <Marquee
              direction="left"
              loop={0}
              autoFill
              className="customMarquee"
            >
              {data?.reviews?.items
                .sort(() => Math.random() - 0.5) // Shuffle items randomly
                .map((item: any, index: any) => (
                  <ReviewCard
                    key={index}
                    text={item.text}
                    author={item.name}
                    image={item.avatarUrl}
                    stars={item.rating}
                  />
                ))}
            </Marquee>
          </div>
        </div>
      </div>
      <div
        className="heroBanner"
        style={{
          backgroundImage: `url(${data?.cta?.imageUrl})`, // Use your "hands" image here
        }}
      >
        <div className="heroContent">
          <div className="heroText">
            <h1>{data?.cta?.title}</h1>
            <p>{data?.cta?.subtitle}</p>
          </div>
          <a
            href={`${data?.cta?.button?.href}`}
            className="heroButton"
            target="_blank"
            rel="noreferrer"
          >
            {data?.cta?.button?.label}
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;

const ReviewCard = ({ text, author, image, stars }: any) => {
  return (
    <div className="reviewCard">
      <div className="reviewStars">
        {Array(stars)
          .fill("")
          .map((_: any, idx: any) => (
            <svg
              key={idx}
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="starIcon"
              viewBox="0 0 24 24"
            >
              <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.93 1.479 8.248-7.415-3.828-7.414 3.828 1.478-8.248-6.063-5.93 8.331-1.151z" />
            </svg>
          ))}
      </div>

      <p className="reviewText">{text}</p>
      <div className="reviewAuthor">
        <img className="authorImage" src={image} alt={author} />
        <p className="authorName">{author}</p>
      </div>
    </div>
  );
};
