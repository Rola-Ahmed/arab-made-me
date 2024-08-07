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


// more details form

import Factorypage from "components/Factories/FactoryPage/Factorypage";
import FactoryProducts from "components/Factories/FactoryProducts/FactoryProductsContainer";

import Productpage from "components/Products/Productpage/ProductPageContainer";
import AllProducts from "components/Products/AllProducts/AllProductsContainer";

// Factory Dashboard pages
import AllSourcingOffers from "components/Sourcinghub/SourcingOffers/SourcingOffers";

// sub routes
// import adminDashboardRoutes from "routes/adminDashboardRoutes";
import importerDashboardRoutes from "routes/importerDashboardRoutes";
import factoryDashboardRoutes from "routes/factoryDashboardRoutes";
import authRoutes from "routes/authRoutes";
import formRoutes from "routes/FormRoutes";



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



      ...authRoutes,
      ...formRoutes,
    ],
  },

  // ---------------------------FORMS---------------

  

  {
    path: "/fetchFactory",
    element: <FetchFactories />,
  },
 

  // view More Details Home page
 
 

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

  // ...adminDashboardRoutes,
  ...importerDashboardRoutes,
  ...factoryDashboardRoutes,
]);

function App() {
  return (
    <Suspense fallback={<div></div>}>
      <ToastContainer />
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
