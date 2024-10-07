import RfqBuyer from "components/Importerdashboard/subComponets/RFQBuyer/AllRfq/AllRfq";
import OneRfqReq from "components/Importerdashboard/subComponets/RFQBuyer/OneRfq/OneRfq";

import PrivateLabelBuyer from "components/Importerdashboard/subComponets/PrivateLabelImp/AllPrivateLabel/AllPrivateLabel";
import OnePrivateLabel from "components/Importerdashboard/subComponets/PrivateLabelImp/OnePrivateLabel/OnePrivateLabel";

import WhiteLabel from "components/Importerdashboard/subComponets/WhiteLabel/AllWhiteLabel/AllWhiteLabel";
import OneWhiteLabel from "components/Importerdashboard/subComponets/WhiteLabel/OneWhiteLabel/OneWhiteLabel";

import CusProductReq from "components/Importerdashboard/subComponets/CusProductReqImp/AllSpmfs/CusProductReqImp";

// Importer Dashboard pages
import SourcingRequest from "components/Importerdashboard/subComponets/SourcingRequest/AddSourcingReq/SourcingRequest";
import Importerdash from "components/Importerdashboard/Importerdash";
import ReqVisitImporter from "components/Importerdashboard/subComponets/ReqVisitImporter/AllVisitReq/AllVisitReq";
import PurchasingOrdersImp from "components/Importerdashboard/subComponets/PO/AllPo/AllPo";

import DashBoardImporter from "components/Importerdashboard/subComponets/DashBoard/DashBoard";
import GetSourcingReq from "components/Importerdashboard/subComponets/SourcingRequest/AllSourcingReq/AllSourcingReq";
import GetQuotationImp from "components/Importerdashboard/subComponets/GetQuotationImp/GetQuotationImp";
import ImporterPofile from "components/Importerdashboard/subComponets/ImporterProfile/ImporterProfile";

// View more details shared (factory & importer)
import VisitRequestEtc from "components/Importerdashboard/subComponets/ReqVisitImporter/oneVisitReq/OneVisitReq";

import PurchasingOrdersEtc from "components/Importerdashboard/subComponets/PO/OnePo/OnePo";

import CustomProductReqEtc from "components/Importerdashboard/subComponets/CusProductReqImp/CustomProductReqEtc/CustomProductReqEtc";

import QuotationsEtc from "components/Importerdashboard/subComponets/GetQuotationImp/QuotationsEtc/QuotationsEtc";

import SourcingReqEtc from "components/Importerdashboard/subComponets/SourcingRequest/OneSourcingReq/SourcingReqEtc";

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
      { path: "", element: <DashBoardImporter /> },

      // done
      { path: "Rfqs", element: <RfqBuyer /> },
      { path: "RFQReq/moreDetails", element: <OneRfqReq /> },

      { path: "PrivateLabel", element: <PrivateLabelBuyer /> },
      { path: "PrivateLabelReq/moreDetails", element: <OnePrivateLabel /> },

      { path: "CustomerProductRequest", element: <CusProductReq /> },
      {
        path: "customProductReq/moreDetails",
        element: <CustomProductReqEtc />,
      },

      // --------------------------------------------------

      { path: "RequestVisit", element: <ReqVisitImporter /> },
      { path: "purchasingOrders", element: <PurchasingOrdersImp /> },

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

      { path: "whiteLabel", element: <WhiteLabel /> },
      { path: "whiteLabel/moredetails", element: <OneWhiteLabel /> },

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
