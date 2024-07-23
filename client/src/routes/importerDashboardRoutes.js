import SourcingRequest from "components/Importerdashboard/subComponets/SourcingRequest/SourcingRequest";

// Importer Dashboard pages
import Importerdash from "components/Importerdashboard/Importerdash";
import RfqImporter from "components/Importerdashboard/subComponets/RFQBuyer/AllRfq/AllRfq";
import ReqVisitImporter from "components/Importerdashboard/subComponets/ReqVisitImporter/ReqVisitImporter";
import PurchasingOrdersImp from "components/Importerdashboard/subComponets/PurchasingOrdersImp/PurchasingOrdersImp";
import PrivateLabelImp from "components/Importerdashboard/subComponets/PrivateLabelImp/AllReq/PrivateLabelImp";
import DashBoardImporter from "components/Importerdashboard/subComponets/DashBoard/DashBoard";
import CusProductReqImp from "components/Importerdashboard/subComponets/CusProductReqImp/AllSpmfs/CusProductReqImp";
import GetSourcingReq from "components/Importerdashboard/subComponets/GetSourcingRequest/GetSourcingRequest";
import GetQuotationImp from "components/Importerdashboard/subComponets/GetQuotationImp/GetQuotationImp";
import ImporterPofile from "components/Importerdashboard/subComponets/ImporterProfile/ImporterProfile";

// View more details shared (factory & importer)
import VisitRequestEtc from "components/Importerdashboard/subComponets/ReqVisitImporter/VisitRequestEtc/VisitRequestEtc";

import PurchasingOrdersEtc from "components/Importerdashboard/subComponets/PurchasingOrdersImp/PurchasingOrderEtc";

import PrivateLabelReqEtc from "components/Importerdashboard/subComponets/PrivateLabelImp/PrivateLabelReqEtc/PrivateLabelReqEtc";

import CustomProductReqEtc from "components/Importerdashboard/subComponets/CusProductReqImp/CustomProductReqEtc/CustomProductReqEtc";

import RfqRequestEtc from "components/Importerdashboard/subComponets/RFQBuyer/OneRfq/OneRfq";

import QuotationsEtc from "components/Importerdashboard/subComponets/GetQuotationImp/QuotationsEtc/QuotationsEtc";

import SourcingReqEtc from "components/ViewMoreDetailsFormDash/SourcingReqEtc/SourcingReqEtc";

// chats
import ChatList from "components/Importerdashboard/subComponets/Chat/ChatList";
import Conversation from "components/Importerdashboard/subComponets/Chat/Converstaion/Conversation";
import NewConversation from "components/Importerdashboard/subComponets/Chat/Converstaion/NewConverstaion/NewConversation";
import IssuePage from "components/IssuePage";

const importerDashboardRoutes = [
  {
    path: "/importerdashboard",
    element: <Importerdash />,
    children: [
      // done
      { path: "Rfqs", element: <RfqImporter /> },

      // --------------------------------------------------
      { path: "", element: <DashBoardImporter /> },
      { path: "RequestVisit", element: <ReqVisitImporter /> },
      { path: "purchasingOrders", element: <PurchasingOrdersImp /> },
      { path: "PrivateLabel", element: <PrivateLabelImp /> },
      { path: "CustomerProductRequest", element: <CusProductReqImp /> },
      {
        path: "add/sourcingRequest",

        element: <SourcingRequest />,
      },
      // -------
      {
        path: "AllQuotations",

        element: <GetQuotationImp />,
      },
      {
        path: "AllSourcingRequests",

        element: <GetSourcingReq />,
      },
      {
        path: "importerProfile",

        element: <ImporterPofile />,
      },

      {
        path: "buyer/verification",

        element: <ImporterPofile />,
      },

      // more details
      {
        path: "factoryVisitReq/moreDetails",

        element: <VisitRequestEtc />,
      },
      {
        path: "purchasingOrderReq/moreDetails",

        element: <PurchasingOrdersEtc />,
      },

      {
        path: "PrivateLabelReq/moreDetails",

        element: <PrivateLabelReqEtc />,
      },
      {
        path: "customProductReq/moreDetails",

        element: <CustomProductReqEtc />,
      },
      {
        path: "RFQReq/moreDetails",

        element: <RfqRequestEtc />,
      },
      {
        path: "quotations/moreDetails",

        element: <QuotationsEtc />,
      },

      {
        path: "SourcingReq/moreDetails",

        element: <SourcingReqEtc />,
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
        element: <IssuePage />,
      },
    ],
  },
];

export default importerDashboardRoutes;
