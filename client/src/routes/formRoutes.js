// forms

// restriction to only allow buyers to access the page,
import CustomerProductReq from "components/Forms/CustomerProductReq/FetchCustomProductContainer";
import WhiteLabelContainer from "components/Forms/WhiteLabel/FetchWhiteLabelContainer";


const formRoutess = [
  {
    // ?factoryId=9&factoryName=Nora%20Dyer
    path: "/CustomerProductReq",
    element: <CustomerProductReq />,
  },
];

export default formRoutess;
