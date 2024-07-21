import { useState, useContext, useEffect } from "react";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import { useNavigate, useSearchParams, useParams } from "react-router-dom";

import Header from "components/main/Header/Header";

import useQuotationFormValidation from "./hooks/useQuotationFormValidation";
import useFormSubmitForAllQoutes from "./hooks/useFormSubmitForAllQoutes";
import QouteForm from "./QouteForm";

// import "./PurchasingOrder.css";
export default function AnswerQuotation() {
  const [searchParams] = useSearchParams();
  let { requestType } = useParams();
  const id = searchParams.get("id");
  const productName = searchParams.get("productName");
  const productId = searchParams.get("productId");
  const importerId = searchParams.get("userId");

  let navigate = useNavigate();
  let { isLogin } = useContext(UserToken);

  let { currentUserData } = useContext(userDetails);

  const [errorMsg, setErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formInfo, setFormInfo] = useState({ formTitle: "", extraData: {} });
  // const [dataForSecpificForm,setDataForSecpificForm ] = useState({
  //   formTitle:'',
  //   initalData:
  // });

  function data(data) {
    switch (data) {
      case "rfq":
        return {
          formTitle: "RFQ",
          extraData: {
            quotationRequestId: id || "",
            productName: productName || "",
            productId: productId || "",
            importerId: importerId || "",
          },
        };

      case "spmf":
        return {
          formTitle: "Custom Product Request",
          extraData: {
            specialManufacturingRequestId: id || "",
            productName: productName || "",
            importerId: importerId || "",
          },
        };
      case "PrivateLabel":
        return {
          formTitle: "Private Label",
          extraData: {
            privateLabelingId: id || "",
            importerId: importerId || "",
            ...(productName && { productName: productName }),
          },
        };
      case "SourcingReq":
        return {
          formTitle: "Sourcing Offer",
          extraData: { sourcingRequestId: id || "" },
        };
      case "WhiteLabel":
        return {
          formTitle: "White Label",
          extraData: { whiteLabelId: id || "" },
        };

      default:
        return "";
    }
  }

  useEffect(() => {
    let info = data(requestType);
    setFormInfo(info);
  }, [requestType]);

  let { submitForm } = useFormSubmitForAllQoutes(
    isLogin,
    setErrorMsg,
    setIsLoading
  );

  function submit(values) {
    submitForm(
      values,
      formInfo?.extraData,
      // {
      //   quotationRequestId: id || "",
      //   productName: productName || "",
      //   productId: productId || "",
      //   importerId: importerId || "",
      // },
      // "rfq"
      requestType
    );
  }
  let formValidation = useQuotationFormValidation(
    // {
    //   quotationRequestId: id || "",
    //   productName: productName || "",
    //   importerId: importerId || "",
    // },
    formInfo?.extraData,
    submit
  );

  return (
    <>
      <Header title={`Send Quotation on ${formInfo?.formTitle}`} />
      <QouteForm
        formValidation={formValidation}
        errorMsg={errorMsg}
        isLoading={isLoading}
      />
    </>
  );
}
