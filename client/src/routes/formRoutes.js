// forms

// restriction to only allow buyers to access the page,
import CustomerProductReq from "components/Forms/CustomerProductReq/FetchCustomProductContainer";
import WhiteLabelContainer from "components/Forms/WhiteLabel/FetchWhiteLabelContainer";
import SendRfq from "components/Forms/RFQ/FetchRfqContainer";
import PrivateLabel from "components/Forms/PrivateLabel/PrivateLabelContainer";

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
];

export default formRoutess;
