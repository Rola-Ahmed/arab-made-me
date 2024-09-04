import { useEffect, useState, useContext } from "react";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";

import ImporterInfo from "components/Shared/ImporterInfo";
import ContactBtn from "components/Factorydashboard/Shared/ContactBtn";

import { getOneRFQ } from "Services/rfq";
import { getQuotes } from "Services/FactoryRequests/quotations";
import { updateRFQ } from "Services/FactoryRequests/rfq";

import RFQinfo from "components/Shared/Dashboards/Forms/RFQinfo";

export default function OneRfqs() {
  let navigate = useNavigate();

  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);

  const [searchParams] = useSearchParams();
  const rfqReqId = searchParams.get("rfqReqId");

  const [apiLoadingData, setApiLoadingData] = useState(true);
  const [error, setError] = useState(true);

  const [showImagePop, setShowImagePop] = useState({
    display: false,
    imagePath: "",
  });
  const handleImageClick = (imagePath) => {
    setShowImagePop({
      display: true,
      imagePath,
    });
  };

  const [requestedData, setRequestedData] = useState({ quoteId: null });

  async function fetchReqData() {
    setApiLoadingData(true);

    let result = await getOneRFQ(rfqReqId, "include=importer&include=product");

    if (result?.success) {
      setRequestedData((prevData) => ({
        ...prevData,
        ...result.data.quotationrequests,
      }));
    } else {
      setError(result?.error);
    }
    setApiLoadingData(false);

    const QouteIdConfigResp = await getQuotes(
      {},
      {
        authorization: isLogin,
      }
    );

    if (QouteIdConfigResp?.success) {
      // Extract the quotations array from the response
      const { quotations } = QouteIdConfigResp.data;

      quotations.forEach((item) => {
        if (item.quotationRequestId == rfqReqId) {
          // Use item.id to match with privateLabelId
          setRequestedData((prevData) => ({
            ...prevData,
            quoteId: item.id, // Use item.id directly
          }));
        }
      });
    }
  }

  async function UpdateData(status) {
    setApiLoadingData(true);

    let response = await updateRFQ(
      rfqReqId,
      { authorization: isLogin },
      { status: status }
    );
    if (response?.success) {
      setRequestedData((prevVal) => ({
        ...prevVal,
        status: status,
      }));
    }
  }

  useEffect(() => {
    // fetch inial data
    fetchReqData();
    // Check if data is being opened for the first time
    // call if once the page is loaded

    if (requestedData && requestedData.status === "open") {
      UpdateData("seen");
    }
  }, [rfqReqId, isLogin]);

  // utils function

  return (
    <>
      <div id="view" className="m-4 order-section  ">
        <SubPageUtility currentPage="More Details" PrevPage="RFQs" />

        <div>
          <div className=" d-flex justify-content-between align-items-center w-100 ">
            <h2 className="">RFQ Details</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => {
                  navigate("/factorydashboard/RfqRequests");
                }}
              >
                <p className="cursor">RFQ Requests </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="section factory-profile m-5">
        <div className="container gap-container">
          <div className="row">
            <div className="col-12  container-2-gap  p-0">
              <ImporterInfo importerData={requestedData?.importer} />

              <RFQinfo
                requestedData={requestedData}
                handleImageClick={handleImageClick}
              />

              {/* <Link>View Quotation on FRQ</Link> */}

              <div className="col-12 d-flex justify-content-start btn-modal-gap">
                {requestedData && requestedData?.quoteId == null ? (
                  <button
                    className="btn-edit "
                    type="button"
                    onClick={() => {
                      navigate(
                        `/answerQuotation/rfq?id=${requestedData?.id}&productName=${requestedData?.productName}&userId=${requestedData?.importerId}&productId=${requestedData?.productId}`
                      );
                    }}
                  >
                    <p className="cursor">send Quote</p>
                  </button>
                ) : (
                  <button
                    className="btn-edit "
                    type="button"
                    onClick={() => {
                      navigate(
                        `/factorydashboard/editQuote/${requestedData?.quoteId}?quotationRequestId=${requestedData?.id}&productName=${requestedData?.productName}`
                      );
                    }}
                  >
                    <p className="cursor">Edit Quote</p>
                  </button>
                )}

              
                <ContactBtn
                  isLogin={isLogin}
                  recieverUserId={requestedData?.importer?.userId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <MediaPopUp
        show={showImagePop.display}
        onHide={() =>
          setShowImagePop({
            display: false,
            imagePath: "",
          })
        }
        showImagePop={showImagePop.imagePath}
      />
    </>
  );
}
