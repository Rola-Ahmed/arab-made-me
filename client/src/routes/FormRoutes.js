// forms

// restriction to only allow buyers to access the page,
import CustomerProductReq from "components/Forms/CustomerProductReq/FetchCustomProductContainer";
import WhiteLabelContainer from "components/Forms/WhiteLabel/FetchWhiteLabelContainer";
import SendRfq from "components/Forms/RFQ/FetchRfqContainer";
import PrivateLabel from "components/Forms/PrivateLabel/PrivateLabelContainer";
import FetchPurchasingOrder from "components/Forms/PurchasingOrder/FetchPurchasingOrder";
import RequestVisit from "components/Forms/RequestVisit/RequestVisit";

import AnswerQuotation from "components/Forms/AnswerQuotation/AnswerQuotation";
import SourcingOfferExtraDetails from "components/Sourcinghub/SourcingOffers/OneSoursingOffer/OneSoursingOffer";

import OneSourcingReq from "components/Sourcinghub/SourcingRequest/OneReq/OneSourcingReq";

const formRoutess = [
  {
    // ?factoryId=9&factoryName=Nora%20Dyer
    path: "/CustomerProductReq",
    element: <CustomerProductReq />,
  },
  {
    path: "/whiteLabelings/form",
    element: <WhiteLabelContainer />,
  },
  {
    path: "/sendrfq",
    element: <SendRfq />,
  },
  {
    path: "/PrivateLabel",
    element: <PrivateLabel />,
  },

  // add auth validation
  {
    path: "/purchasingOrder/:requestType",
    element: <FetchPurchasingOrder />,
  },
  {
    path: "/requestVisit",
    element: <RequestVisit />,
  },

  // factory forms

  {
    path: "/answerQuotation/:requestType",
    element: <AnswerQuotation />,

    // /answerQuotation/rfq?id=${requestedData?.id}&productName=${requestedData?.productName}&userId=${requestedData?.importerId}&productId=${requestedData?.productId}
  },

  {
    // path: "/sourcingBuyerRequest/:buyerReuestId",
    path: "/sourcingRequest",
    element: <OneSourcingReq />,
  },
  {
    path: "/sourcingOffer/:offerId",
    element: <SourcingOfferExtraDetails />,
  },
];

export default formRoutess;
