// admin Dashboard

import AdminDashboard from "components/AdminDashboard/Admindash";
import PrivateLabelAdmin from "components/AdminDashboard/subComponets/PrivateLabelAdmin/PrivateLabelAdmin";
import CustomProductAdmin from "components/AdminDashboard/subComponets/CustomProductAdmin/CustomProductAdmin";
import VisitRequestAdmin from "components/AdminDashboard/subComponets/VisitRequestAdmin/VisitRequestAdmin";
import RfqRequestAdmin from "components/AdminDashboard/subComponets/RfqRequestAdmin/RfqRequestAdmin";
import PORequestAdmin from "components/AdminDashboard/subComponets/PORequestAdmin/PORequestAdmin";

const adminDashboardRoutes = [
  {
    path: "admin/adminDashboard/",
    element: <AdminDashboard />,
    children: [
      { path: "PrivateLabel", element: <PrivateLabelAdmin /> },

      // fix api
      { path: "CustomProductRequest", element: <CustomProductAdmin /> },
      { path: "VisitRequestVisit", element: <VisitRequestAdmin /> },
      { path: "RfqRequests", element: <RfqRequestAdmin /> },
      { path: "purchasingOrders", element: <PORequestAdmin /> },

      // { path: "", element: <DashBoard /> },
      // { path: "quotations", element: <ViewQuotations /> },
      // { path: "purchasingOrders", element: <Orders /> },

      // { path: "CustomerProductRequest", element: <CusProductReq /> },

      // { path: "AllFactoryProducts", element: <GetAllFactoryProduct /> },
      // { path: "addProduct", element: <AddProduct /> },
      // { path: "addSourcingOffer", element: <AddSourcingOffer /> },
      // { path: "AllFactoryOffers", element: <ViewSourcingOfferFac /> },
      // { path: "mircoSite", element: <MircoSiteDash /> },

      // { path: "editProduct/:productId", element: <EditProduct /> },

      // {
      //   path: "factoryProfile/",
      //   element: <FactoryProfile />,
      // },

      // {
      //   path: "factory/verification",
      //   element: <FactoryUnVerified />,
      // },

      //--------- more details
      // {
      //   path: "PrivateLabelReq/moreDetails",

      //   element: <PrivateLabelReqFacEtc />,
      // },
      // {
      //   path: "customProductReq/moreDetails",

      //   element: <CustomProductReqFacEtc />,
      // },

      // {
      //   path: "factoryVisitReq/moreDetails",

      //   element: <VisitRequestFacEtc />,
      // },

      // {
      //   path: "RFQReq/moreDetails",

      //   element: <RfqRequestFacEtc />,
      // },

      // {
      //   path: "purchasingOrderReq/moreDetails",

      //   element: <PurchasingOrdersFacEtc />,
      // },
      // {
      //   path: "quotations/moreDetails",

      //   element: <QuotationsFacEtc />,
      // },

      // {
      //   path: "product/moreDetails",

      //   element: <ProductsFacEtc />,
      // },
      // {
      //   path: "offers/moreDetails",

      //   element: <OffersFacEtc />,
      // },
    ],
  },
];
export default adminDashboardRoutes;
