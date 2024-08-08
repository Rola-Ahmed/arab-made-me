// Factory Dashboard pages
import Factorydash from "containers/Factorydashboard/FactorydashContainer";

// private Label Data
import PrivateLabeLReq from "components/Factorydashboard/subComponets/PrivateLabelRequest/Index/IndexContainer";
import EtcPrivateLabelReq from "components/Factorydashboard/subComponets/PrivateLabelRequest/MoreDetails/OnePrivateLabelReq";

import WhiteLabeLReq from "components/Factorydashboard/subComponets/WhiteLabel/Index/IndexContainer";
import EtcWhiteLabelReq from "components/Factorydashboard/subComponets/WhiteLabel/MoreDetails/OneWhiteLabelReq";

import FactoryProfile from "components/Factorydashboard/subComponets/FactoryProfile/FactoryProfile";
import Orders from "components/Factorydashboard/subComponets/PoRequests/AllPos/Orders";
import DashBoard from "components/Factorydashboard/subComponets/DashBoard/DashBoard";
import RfqFactoryDash from "components/Factorydashboard/subComponets/RfqFactoryDash/AllFRQs/AllRfqs";

import CusProductReq from "components/Factorydashboard/subComponets/CusProductReq/AllSpmf/AllSpmf";
import ReqVisitFactDash from "components/Factorydashboard/subComponets/ReqVisitFactDash/AllReqVisit/ReqVisitFactDash";
import GetAllFactoryProduct from "components/Factorydashboard/subComponets/Products/GetProducts/GetProducts";
import EditProduct from "components/Factorydashboard/subComponets/Products/EditProduct/EditProduct";
import AddProduct from "components/Factorydashboard/subComponets/Products/AddProduct/AddProduct";
import AddSourcingOffer from "components/Factorydashboard/offers/AddOffer/AddOffer";
import AllOffers from "components/Factorydashboard/offers/AllOffers/AllOffers";
import MircoSiteDash from "components/Factorydashboard/subComponets/MircoSiteDash/MircoSiteDash";
import EditQuote from "components/Factorydashboard/subComponets/Quotations/EditQuote/EditQuote";

// Importer Dashboard pages

import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedDash";

import VisitRequestFacEtc from "components/Factorydashboard/subComponets/ReqVisitFactDash/EtcVisitRequest/EtcVisitRequest";

import PurchasingOrdersFacEtc from "components/Factorydashboard/subComponets/PoRequests/OnePo/OnePo";

import CustomProductReqFacEtc from "components/Factorydashboard/subComponets/CusProductReq/EtcCustomProductReq/EtcCustomProductReq";
import RfqRequestFacEtc from "components/Factorydashboard/subComponets/RfqFactoryDash/OneRfqs/OneRfqs";

// factory only
import ProductsFacEtc from "components/ViewMoreDetailsFormDash/ProductsFacEtc/ProductsFacEtc";
import OffersFacEtc from "components/Factorydashboard/offers/OneOffer/OneOffer";

// Quote data Container
import ViewQuotations from "components/Factorydashboard/subComponets/Quotations/AllQuotes/AllQuotes";
import QuotationsFacEtc from "components/Factorydashboard/subComponets/Quotations/EtcQuote/EtcQuote";

// Correct

// chats
import ChatList from "components/Factorydashboard/subComponets/Chat/ChatList";
import Conversation from "components/Factorydashboard/subComponets/Chat/Converstaion/Conversation";
import NewConversation from "components/Factorydashboard/subComponets/Chat/NewConverstaion/NewConversation";
import UnAuthPage from "components/UnAuthPage";

const factoryDashboardRoutes = [
  {
    path: "/factorydashboard/",
    element: <Factorydash />,
    children: [
      { path: "", element: <DashBoard /> },

      // RFQ Done
      { path: "RfqRequests", element: <RfqFactoryDash /> },
      { path: "RFQReq/moreDetails", element: <RfqRequestFacEtc /> },

      // private label req
      { path: "PrivateLabel", element: <PrivateLabeLReq /> },
      { path: "PrivateLabelReq/moreDetails", element: <EtcPrivateLabelReq /> },

      // white label req
      { path: "whiteLabel", element: <WhiteLabeLReq /> },
      { path: "whiteLabel/moreDetails", element: <EtcWhiteLabelReq /> },

      { path: "quotations", element: <ViewQuotations /> },
      // { path: "editQuote/:quoteId", element: <EditQuote /> },
      { path: "editQuote/:quoteId", element: <EditQuote /> },

      { path: "purchasingOrders", element: <Orders /> },

      { path: "CustomerProductRequest", element: <CusProductReq /> },
      { path: "FactoryRequestVisit", element: <ReqVisitFactDash /> },
      { path: "AllFactoryProducts", element: <GetAllFactoryProduct /> },
      { path: "addProduct", element: <AddProduct /> },
      { path: "addSourcingOffer", element: <AddSourcingOffer /> },
      { path: "AllFactoryOffers", element: <AllOffers /> },
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
      {
        path: "403",
        element: <UnAuthPage />,
      },
    ],
  },
];

export default factoryDashboardRoutes;
