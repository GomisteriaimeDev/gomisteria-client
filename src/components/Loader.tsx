import loader from "../assets/images/loader.gif";
import logo from "../assets/svg/Gomisteria_LOADER_1.gif";
import "./Loader.scss";

const Loader = ({ isLoading }: any) => {
  return (
    <div className={`loader-overlay ${!isLoading ? "slide-up" : ""}`}>
      <img src={logo} alt="Loading..." className="loader-logo" />
      {/* <img src={loader} alt="Loading..." className="loader-img" /> */}
    </div>
  );
};

export default Loader;
