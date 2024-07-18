import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "components/Layout/Layout";
import { StrictMode, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "components/Home/home";
import Loading from "components/Loading/Loading";
import Factories from "components/Factories/AllFactories/FetchFactories";
import AboutUs from "components/About-us/AboutUs";
import Sourcinghub from "components/Sourcinghub/SourcingRequest/SourcingRequest";
import Errorpage from "components/Errorpage";

// contact for arab-made itself
import ContactArabMade from "components/Contact/Contact";

// conact page for each factory
import ContactSupplierFactoryPg from "components/Factories/ContactSupplierFactoryPg/ContactSupplierFactoryPg";

// forms
// OutSide Formsclean

// forms
import Contactsupplier from "components/Forms/Contactsupplier/Contactsupplier";

import AnswerQuotation from "components/Forms/AnswerQuotation/AnswerQuotation";
import AnsQuotationPrivateLabel from "components/Forms/AnswerQuotation/AnsQuotationPrivateLabel";

// more details form
import SourcingOfferExtraDetails from "components/SourcingOfferExtraDetails/SourcingOfferExtraDetails";
import SourcingRequestExtraDetails from "components/SourcingRequestExtraDetails/SourcingRequestExtraDetails";

import Factorypage from "components/Factories/FactoryPage/Factorypage";
import FactoryProducts from "components/Factories/FactoryProducts/FactoryProductsContainer";

import Productpage from "components/Products/Productpage/ProductPageContainer";
import AllProducts from "components/Products/AllProducts/AllProductsContainer";

// Factory Dashboard pages
import AllSourcingOffers from "components/Sourcinghub/AllSourcingOffers/AllSourcingOffers";

// sub routes
import adminDashboardRoutes from "routes/adminDashboardRoutes";
import importerDashboardRoutes from "routes/importerDashboardRoutes";
import factoryDashboardRoutes from "routes/factoryDashboardRoutes";
import authRoutes from "routes/authRoutes";
import formRoutes from "routes/formRoutes";

import MeetingRoom from "components/MeetingRoom/MeetingRoom";
import Invitaion from "components/MeetingRoom/Invitaion";
import UnAuthPage from "components/UnAuthPage";
import FetchFactories from "components/Factories/AllFactories/FetchFactories";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      // market palces start-----------------------------
      {
        path: "factoryGallery",
        element: <Factories />,
      },
      {
        path: "productMarketPlace/:sectorID?",
        element: <AllProducts />,
      },

      {
        path: "factoryProducts/MarketPlace",
        element: <FactoryProducts />,
      },
      {
        path: "/sourcinghub/sourcingRequests",
        element: <Sourcinghub />,
      },
      {
        path: "/sourcinghub/sourcingOffers",
        element: <AllSourcingOffers />,
      },
      {
        path: "/productpage/:ProductIdProductNameFactoryName",
        element: <Productpage />,
      },
      {
        path: "/factorypage/:factoryIdName?",
        element: <Factorypage />,
      },

      // market palces end-----------------------------
      {
        path: "/contactCompany",
        element: <ContactSupplierFactoryPg />,
      },
      {
        // `contactsupplier?userId=${factoryDetails?.id}&importerName=${factoryDetails?.name}`,
        path: "/contactsupplier",
        element: <Contactsupplier />,
      },

      // main bars
      {
        path: "/aboutus",
        element: <AboutUs />,
      },
      {
        path: "/contact",
        element: <ContactArabMade />,
      },

      // formssssssssssssssssssssssssssssssss

      // -------------------------
      {
        path: "mettingRoom",
        element: <MeetingRoom />,
      },
      // {
      //   path: "inviation/:id",
      //   element: <MeetingRoom />,
      // },
      {
        path: "vpaas-magic-cookie-8f03c02025c64a96b9130e33703c5b35/SampleAppUsedSeparationsRetreatFundamentally",
        element: <Invitaion />,
      },
      // ---------------------------------

      ...authRoutes,
      ...formRoutes,
    ],
  },

  // ---------------------------FORMS---------------

  {
    path: "/answerQuotation",
    element: <AnswerQuotation />,
  },

  {
    path: "/fetchFactory",
    element: <FetchFactories />,
  },
  {
    path: "/answerQuotationPrivateLabel",
    element: <AnsQuotationPrivateLabel />,
  },

  // view More Details Home page
  {
    path: "/sourcingOffer/:offerId",
    element: <SourcingOfferExtraDetails />,
  },
  {
    path: "/sourcingBuyerRequest/:buyerReuestId",
    element: <SourcingRequestExtraDetails />,
  },

  {
    path: "loading",
    element: <Loading />,
  },
  // error pages
  {
    path: "*",
    element: <Errorpage />,
  },
  {
    path: "403",
    element: <UnAuthPage />,
  },

  ...adminDashboardRoutes,
  ...importerDashboardRoutes,
  ...factoryDashboardRoutes,
]);

function App() {
  return (
    <Suspense fallback={<div></div>}>
      {/* <ToastContainer /> */}
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
