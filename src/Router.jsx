import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Login from "./views/MV/Entry/Login.jsx";
import Register from "./views/MV/Entry/Register.jsx";
import ForgotPassword from "./views/MV/Entry/ForgotPassword.jsx";
import ResetPassword from "./views/MV/Entry/ResetPassword.jsx";

import Offers from "./views/MV/Screens/Offers.jsx";
import ProductDetail from "./views/MV/Screens/ProductDetail.jsx";
import Cart from "./views/MV/Screens/Cart.jsx";
import Checkout from "./views/MV/Screens/Checkout.jsx";
import ProductsListing from "./views/MV/Screens/ProductsListing.jsx";

import Profile from "./views/MV/Profile/Profile.jsx";
import ProfileDetails from "./views/MV/Profile/components/ProfileDetails.jsx";
import OrderDetail from "./views/MV/Profile/components/OrderDetail.jsx";
import Addresses from "./views/MV/Profile/components/Addresses.jsx";
import Cards from "./views/MV/Profile/components/Cards.jsx";
import Settings from "./views/MV/Profile/components/Settings.jsx";
import SearchResults from "./views/MV/LandingPage/Components/SearchResults.jsx";
import Payment from "./views/MV/Screens/Payment.jsx";
import AuthGuard from "./Auth";
import OrderHistoryNew from "./views/MV/Profile/components/OrderHistoryNew.jsx";
import LandingPage from "./views/MV/LandingPage/index.jsx";
import Vendordetail from "./views/MV/Screens/Vendordetail.jsx";
import ScrollToTop from "./ScrollToTop.js";
import ReturnPolicy from "./views/MV/Screens/ReturnPolicy.jsx";
import ContactUs from "./views/MV/Screens/ContactUs.jsx";
import PrivacyPolicy from "./views/MV/Screens/PrivacyPolicy.jsx";
import Qoute from "./views/MV/Screens/Qoute.jsx";
import RFQHistory from "./views/MV/Profile/components/RFQHistory.jsx";
import RfqDetail from "./views/MV/Profile/components/RfqDetail.jsx";
import RfqResponse from "./views/MV/Profile/components/RfqResponse.jsx";
import GoodsReceiptNote from "./views/MV/Profile/components/GoodsReceiptNote.jsx";
import Blogs from "./views/MV/Blogs/index.jsx";
import SingleBlog from "./views/MV/Blogs/components/SingleBlog.jsx";

const Router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/",
    element: (
      <ScrollToTop>
        <LandingPage />
      </ScrollToTop>
    ),
  },
  {
    path: "/offers",
    element: <Offers />,
  },

  {
    path: "/privacy-policy",
    element: (
      <ScrollToTop>
        <PrivacyPolicy />
      </ScrollToTop>
    ),
  },
  {
    path: "/contact-us",
    element: (
      <ScrollToTop>
        <ContactUs />
      </ScrollToTop>
    ),
  },
  {
    path: "/return-policy",
    element: (
      <ScrollToTop>
        <ReturnPolicy />
      </ScrollToTop>
    ),
  },
  {
    path: "/blogs",
    element: (
      <ScrollToTop>
        <Blogs />
      </ScrollToTop>
    ),
  },
  {
    path: "/blogs/:slug",
    element: (
      <ScrollToTop>
        <SingleBlog />
      </ScrollToTop>
    ),
  },
  {
    path: "/category/:catId",
    element: (
      <ScrollToTop>
        <ProductsListing />
      </ScrollToTop>
    ),
  },
  {
    path: "/productdetail/:id",
    element: (
      <ScrollToTop>
        <ProductDetail />
      </ScrollToTop>
    ),
  },
  {
    path: "/cart",
    element: (
      <ScrollToTop>
        <Cart />
      </ScrollToTop>
    ),
  },
  {
    path: "/qoute/:id?",
    element: (
      <ScrollToTop>
        <Qoute />
      </ScrollToTop>
    ),
  },
  {
    path: "/vendordetail/:slug",
    element: (
      <ScrollToTop>
        <Vendordetail />
      </ScrollToTop>
    ),
  },
  {
    path: "/checkout",
    element: (
      <ScrollToTop>
        <AuthGuard>
          <Checkout />
        </AuthGuard>
      </ScrollToTop>
    ),
  },
  {
    path: "/payment/:id",
    element: (
      <ScrollToTop>
        <AuthGuard>
          <Payment />
        </AuthGuard>
      </ScrollToTop>
    ),
  },
  {
    path: "/profile",
    element: (
      <ScrollToTop>
        <AuthGuard>
          <Profile />
        </AuthGuard>
      </ScrollToTop>
    ),
    children: [
      {
        path: "",
        element: (
          <ScrollToTop>
            <AuthGuard>
              <ProfileDetails />
            </AuthGuard>
          </ScrollToTop>
        ),
      },
      {
        path: "addresses",
        element: (
          <ScrollToTop>
            <AuthGuard>
              <Addresses />
            </AuthGuard>
          </ScrollToTop>
        ),
      },
      {
        path: "order-history",
        element: (
          <ScrollToTop>
            <AuthGuard>
              <OrderHistoryNew />
            </AuthGuard>
          </ScrollToTop>
        ),
      },
      {
        path: "orderdetail/:id",
        element: (
          <ScrollToTop>
            <AuthGuard>
              <OrderDetail />
            </AuthGuard>
          </ScrollToTop>
        ),
      },
      {
        path: "rfq-history",
        element: (
          <ScrollToTop>
            <AuthGuard>
              <RFQHistory />
            </AuthGuard>
          </ScrollToTop>
        ),
      },
      {
        path: "rfqdetail/:id",
        element: (
          <ScrollToTop>
            <AuthGuard>
              <RfqDetail />
            </AuthGuard>
          </ScrollToTop>
        ),
      },
      {
        path: "rfqresponse/:id/:rfqId",
        element: (
          <ScrollToTop>
            <AuthGuard>
              <RfqResponse />
            </AuthGuard>
          </ScrollToTop>
        ),
      },
      {
        path: "rfq-good-receipt/:id",
        element: (
          <ScrollToTop>
            <AuthGuard>
              <GoodsReceiptNote />
            </AuthGuard>
          </ScrollToTop>
        ),
      },
      {
        path: "cards",
        element: (
          <ScrollToTop>
            <AuthGuard>
              <Cards />
            </AuthGuard>
          </ScrollToTop>
        ),
      },
      {
        path: "settings",
        element: (
          <ScrollToTop>
            <AuthGuard>
              <Settings />
            </AuthGuard>
          </ScrollToTop>
        ),
      },
    ],
  },
  {
    path: "search/:query",
    element: (
      <ScrollToTop>
        <SearchResults />
      </ScrollToTop>
    ),
  },
]);

const RootComponent = () => {
  return <RouterProvider router={Router} />;
};

export default RootComponent;
