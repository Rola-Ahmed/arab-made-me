// Factory Dashboard pages
import Factorydash from "containers/Factorydashboard/FactorydashContainer";

// private Label Data
import PrivateLabeLReq from "containers/Factorydashboard/subComponets/PrivateLabeFactDash/IndexContainer";
import EtcPrivateLabelReq from "containers/Factorydashboard/subComponets/PrivateLabeFactDash/EtcPrivateLabelReqContainer";

import FactoryProfile from "components/Factorydashboard/subComponets/FactoryProfile/FactoryProfile";
import Orders from "components/Factorydashboard/subComponets/Orders/Orders";
import DashBoard from "components/Factorydashboard/subComponets/DashBoard/DashBoard";
import RfqFactoryDash from "components/Factorydashboard/subComponets/RfqFactoryDash/AllFRQs/AllRfqs";

import CusProductReqFactDash from "components/Factorydashboard/subComponets/CusProductReqFactDash/CusProductReqFactDash";
import ReqVisitFactDash from "components/Factorydashboard/subComponets/ReqVisitFactDash/ReqVisitFactDash";
import GetAllFactoryProduct from "components/Factorydashboard/subComponets/Products/GetProducts/GetProducts";
import EditProduct from "components/Factorydashboard/subComponets/Products/EditProduct/EditProduct";
import AddProduct from "components/Factorydashboard/subComponets/Products/AddProduct/AddProduct";
import AddSourcingOffer from "components/Factorydashboard/subComponets/AddSourcingOffer/AddSourcingOffer";
import ViewSourcingOfferFac from "components/Factorydashboard/subComponets/ViewSourcingOfferFac/ViewSourcingOfferFac";
import MircoSiteDash from "components/Factorydashboard/subComponets/MircoSiteDash/MircoSiteDash";
import EditQuote from "components/Factorydashboard/subComponets/Quotations/EditQuote/EditQuote";

// Importer Dashboard pages

import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedDash";

import VisitRequestFacEtc from "components/Factorydashboard/subComponets/ReqVisitFactDash/EtcVisitRequest/EtcVisitRequest";

import PurchasingOrdersFacEtc from "components/ViewMoreDetailsFormDash/PurchasingOrderEtc/PurchasingOrdersFacEtc";

import CustomProductReqFacEtc from "components/Factorydashboard/subComponets/CusProductReqFactDash/EtcCustomProductReq/EtcCustomProductReq";
import RfqRequestFacEtc from "components/Factorydashboard/subComponets/RfqFactoryDash/OneRfqs/OneRfqs";

// factory only
import ProductsFacEtc from "components/ViewMoreDetailsFormDash/ProductsFacEtc/ProductsFacEtc";
import OffersFacEtc from "components/ViewMoreDetailsFormDash/OffersFacEtc/OffersFacEtc";

// Quote data Container
import ViewQuotations from "containers/Factorydashboard/subComponets/Quotations/ViewQuoteContainer";
import QuotationsFacEtc from "containers/Factorydashboard/subComponets/Quotations/EtcQuoteContainer";

// Correct

// chats
import ChatList from "components/Factorydashboard/subComponets/Chat/ChatList";
import Conversation from "components/Factorydashboard/subComponets/Chat/Converstaion/Conversation";
import NewConversation from "components/Factorydashboard/subComponets/Chat/NewConverstaion/NewConversation";

const factoryDashboardRoutes = [
  {
    path: "/factorydashboard/",
    element: <Factorydash />,
    children: [
      { path: "", element: <DashBoard /> },




      // RFQ
      { path: "RfqRequests", element: <RfqFactoryDash /> },
      {
        path: "RFQReq/moreDetails",

        element: <RfqRequestFacEtc />,
      },

      

      // private label req
      { path: "PrivateLabel", element: <PrivateLabeLReq /> },
      {
        path: "PrivateLabelReq/moreDetails",
        element: <EtcPrivateLabelReq />,
      },

      { path: "quotations", element: <ViewQuotations /> },
      // { path: "editQuote/:quoteId", element: <EditQuote /> },
      { path: "editQuote/:quoteId", element: <EditQuote /> },

     
      { path: "purchasingOrders", element: <Orders /> },

      { path: "CustomerProductRequest", element: <CusProductReqFactDash /> },
      { path: "FactoryRequestVisit", element: <ReqVisitFactDash /> },
      { path: "AllFactoryProducts", element: <GetAllFactoryProduct /> },
      { path: "addProduct", element: <AddProduct /> },
      { path: "addSourcingOffer", element: <AddSourcingOffer /> },
      { path: "AllFactoryOffers", element: <ViewSourcingOfferFac /> },
      { path: "mircoSite", element: <MircoSiteDash /> },
      { path: "editProduct/:productId", element: <EditProduct /> },

      {
        path: "factoryProfile/",
        element: <FactoryProfile />,
      },

      {
        path: "factory/verification",
        element: <FactoryUnVerified />,
      },

      {
        path: "customProductReq/moreDetails",

        element: <CustomProductReqFacEtc />,
      },

      {
        path: "factoryVisitReq/moreDetails",

        element: <VisitRequestFacEtc />,
      },

    

      {
        path: "purchasingOrderReq/moreDetails",

        element: <PurchasingOrdersFacEtc />,
      },
      {
        path: "quotations/moreDetails",

        element: <QuotationsFacEtc />,
      },

      {
        path: "product/moreDetails",

        element: <ProductsFacEtc />,
      },
      {
        path: "offers/moreDetails",

        element: <OffersFacEtc />,
      },

      {
        path: "chatList",

        element: <ChatList />,
      },
      {
        path: "conversation",
        element: <Conversation />,
      },
      {
        path: "NewConversation",
        element: <NewConversation />,
      },
    ],
  },
];

export default factoryDashboardRoutes;
