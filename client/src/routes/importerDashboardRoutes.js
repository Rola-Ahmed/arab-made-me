import RfqBuyer from "components/Importerdashboard/subComponets/RFQBuyer/AllRfq/AllRfq";
import OneRfqReq from "components/Importerdashboard/subComponets/RFQBuyer/OneRfq/OneRfq";

import PrivateLabelBuyer from "components/Importerdashboard/subComponets/PrivateLabelImp/AllReq/PrivateLabelImp";
import OnePrivateLabel from "components/Importerdashboard/subComponets/PrivateLabelImp/PrivateLabelReqEtc/PrivateLabelReqEtc";

import CusProductReq from "components/Importerdashboard/subComponets/CusProductReqImp/AllSpmfs/CusProductReqImp";


// Importer Dashboard pages
import SourcingRequest from "components/Importerdashboard/subComponets/SourcingRequest/SourcingRequest";
import Importerdash from "components/Importerdashboard/Importerdash";
import ReqVisitImporter from "components/Importerdashboard/subComponets/ReqVisitImporter/ReqVisitImporter";
import PurchasingOrdersImp from "components/Importerdashboard/subComponets/PurchasingOrdersImp/PurchasingOrdersImp";

import DashBoardImporter from "components/Importerdashboard/subComponets/DashBoard/DashBoard";
import GetSourcingReq from "components/Importerdashboard/subComponets/GetSourcingRequest/GetSourcingRequest";
import GetQuotationImp from "components/Importerdashboard/subComponets/GetQuotationImp/GetQuotationImp";
import ImporterPofile from "components/Importerdashboard/subComponets/ImporterProfile/ImporterProfile";

// View more details shared (factory & importer)
import VisitRequestEtc from "components/Importerdashboard/subComponets/ReqVisitImporter/VisitRequestEtc/VisitRequestEtc";

import PurchasingOrdersEtc from "components/Importerdashboard/subComponets/PurchasingOrdersImp/PurchasingOrderEtc";


import CustomProductReqEtc from "components/Importerdashboard/subComponets/CusProductReqImp/CustomProductReqEtc/CustomProductReqEtc";

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
      { path: "", element: <DashBoardImporter /> },
      
      // done
      { path: "Rfqs", element: <RfqBuyer /> },
      { path: "RFQReq/moreDetails", element: <OneRfqReq /> },

      { path: "PrivateLabel", element: <PrivateLabelBuyer /> },
      { path: "PrivateLabelReq/moreDetails", element: <OnePrivateLabel /> },


      { path: "CustomerProductRequest", element: <CusProductReq /> },
      { path: "customProductReq/moreDetails", element: <CustomProductReqEtc />,
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
