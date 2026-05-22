import "./App.scss";
import { Route, Routes } from "react-router-dom";
import IntroPage from "./pages/IntroPage/IntroPage";
import Login from "./pages/Login/Login";
import RegisterSelect from "./pages/Register/Select/RegisterSelect";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import AboutUs from "./pages/AboutUs/AboutUs";
import Client from "./pages/Register/Client/Client";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Business from "./pages/Register/Business/Business";
import SuccessBusiness from "./pages/Register/SuccessBusiness/SuccessBusiness";
import ProtectedRoute from "./utils/ProtectedRoute";
import Account from "./pages/Account/Account";
import Reservation from "./pages/Reservation/Reservation";
import Services from "./pages/Services/Services";
import ServicesWork from "./pages/Services/ServicesWork/ServicesWork";
import RoadAssistance from "./pages/Services/RoadAssistance/RoadAssistance";
// import ServicesCart from "./pages/Services/ServicesCart/ServicesCart";
import ServiceCartSuccess from "./pages/Services/ServicesCart/ServiceCartSuccess/ServiceCartSuccess";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import CartSuccess from "./pages/CartSuccess/CartSuccess";
import Goma from "./pages/HomePage/Goma/Goma";
import Aksesore from "./pages/HomePage/Aksesore/Aksesore";
import Fellne from "./pages/HomePage/Fellne/Fellne";
import RedirectIfAuthenticated from "./utils/RedirectIfAuth";
import SingleGoma from "./pages/Single/SingleGoma/SingleGoma";
import SingleFellne from "./pages/Single/SingleFellne/SingleFellne";
import SingleAksesore from "./pages/Single/SingleAksesore/SingleAksesore";
import Invoice from "./pages/CartSuccess/Invoice/Invoice";
import AccountOrders from "./pages/Account/Orders/AccountOrders";
import Search from "./pages/Search/Search";
import SingleReservation from "./pages/Reservation/SingleReservation/SingleReservation";
import ReservationSuccess from "./pages/Reservation/ReservationSuccess/ReservationSuccess";
import Invoices from "./pages/Account/Invoices/Invoices";
import OrderDetails from "./pages/Account/Orders/OrderDetails/OrderDetails";
import AccountReservations from "./pages/Account/Reservations/AccountReservations";
import ReservationDetails from "./pages/Account/Reservations/ReservationDetails/ReservationDetails";
import NotFound from "./pages/NotFound/NotFound";
import HomePage from "./pages/HomePage/HomePage";
import Wishlist from "./pages/Account/Wishlist/Wishlist";
import ReservationCart from "./pages/ReservationCart/ReservationCart";
import ReservationCheckout from "./pages/ReservationCheckout/ReservationCheckout";
import Verification from "./pages/Verification/Verification";
import SuccessClient from "./pages/Register/SuccessClient/SuccessClient";

function App() {
  return (
    <div className="App">
      <Routes>
      <Route
          path="/verify-phone/:id"
          element={
            <RedirectIfAuthenticated>
              <Verification />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectIfAuthenticated>
              <ForgotPassword />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/reset-password"
          element={
            <RedirectIfAuthenticated>
              <ResetPassword />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register/select"
          element={
            <RedirectIfAuthenticated>
              <RegisterSelect />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register/client"
          element={
            <RedirectIfAuthenticated>
              <Client />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register/business"
          element={
            <RedirectIfAuthenticated>
              <Business />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register/business/success"
          element={
            <RedirectIfAuthenticated>
              <SuccessBusiness />
            </RedirectIfAuthenticated>
          }
        />
         <Route
          path="/register/client/success"
          element={
            <RedirectIfAuthenticated>
              <SuccessClient />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/"
          element={
            <RedirectIfAuthenticated>
              <IntroPage />
            </RedirectIfAuthenticated>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          {/* <Route path="/produkt/:id" element={<Single />} /> */}
          <Route path="/search" element={<Search />} />
          {/* <Route path="/products" element={<Products />} /> */}
          <Route path="/goma" element={<Goma />} />
          <Route path="/gomë/:id" element={<SingleGoma />} />
          <Route path="/fellne" element={<Fellne />} />
          <Route path="/fellne/:id" element={<SingleFellne />} />
          <Route path="/aksesorë" element={<Aksesore />} />
          <Route path="/aksesorë/:id" element={<SingleAksesore />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/wishlist" element={<Wishlist />} />
          <Route path="/account/orders" element={<AccountOrders />} />
          <Route path="/account/invoices" element={<Invoices />} />
          <Route path="/account/order/:id" element={<OrderDetails />} />
          <Route path="/account/reservations" element={<AccountReservations />} />
          <Route path="/account/reservation/:id" element={<ReservationDetails />} />
          <Route path="/invoice/:id" element={<Invoice />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cart/checkout" element={<Checkout />} />
          <Route path="/cart/success" element={<CartSuccess />} />
          <Route path="/cart/invoice" element={<Invoice />} />
          <Route path="/services" element={<Services />} />
          {/* <Route path="/services/cart" element={<ServicesCart />} /> */}
          <Route path="/services/success" element={<ServiceCartSuccess />} />
          <Route path="/services/booking" element={<ServicesWork />} />
          <Route
            path="/services/road-assistance"
            element={<RoadAssistance />}
          />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/reservation/:id" element={<SingleReservation />} />
          <Route path="/reservation/success" element={<ReservationSuccess />} />
          <Route path="/reservation/cart/:id" element={<ReservationCart />} />
          <Route
            path="/reservation/checkout/:id"
            element={<ReservationCheckout />}
          />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </div>
  );
}

export default App;

/*Made by Selmin Memo Lekovic :D*/
