import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { baseUrl } from "config.js";
import { UserToken } from "Context/userToken";
import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
import { useNavigate, useSearchParams } from "react-router-dom";
// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import OfferInfo from "components/Shared/Dashboards/Forms/OfferInfo";
export default function OneOffer() {
  let navigate = useNavigate();

  let { isLogin } = useContext(UserToken);


  const [searchParams] = useSearchParams();
  const factoryOffersId = searchParams.get("factoryOffersId");

  const [apiLoadingData, setapiLoadingData] = useState(true);

  const [PosData, setPosData] = useState();
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

  async function fetchReqData() {
    setapiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/factories/factory/offers`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        // setPosData(response?.data?.sourcingOffers);

        const matchedObject = response.data.offers.find(
          (obj) => obj.id == factoryOffersId
        );

        if (matchedObject) {
          setPosData(matchedObject);
        }

        setapiLoadingData(false);
      } else {
        setapiLoadingData(true);
      }
    } catch (error) {
      setapiLoadingData(true);
    }
  }

  useEffect(() => {
    fetchReqData();
  }, [factoryOffersId]);

 

  return (
    <>
    

      {isLogin && (
        <>
          <div id="view" className="m-4 order-section  ">
            <SubPageUtility
              currentPage="More Details"
              PrevPage="Offer Details"
            />

            <div>
              <div className=" d-flex justify-content-between align-items-center w-100 ">
                <h2>Offer Details</h2>

                <div className="btn-container">
                  <button
                    type="button"
                    className="order-btn-1"
                    onClick={() => {
                      navigate("/factorydashboard/AllFactoryOffers");
                    }}
                  >
                    <p className="cursor"> Offers</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="section factory-profile m-5">
            <div className="container gap-container px-0">
                <div className=" container-2-gap  p-0">
                <OfferInfo requestedData={PosData} handleImageClick={handleImageClick} />

                  {/* <div className="col-12 d-flex justify-content-start btn-modal-gap">
                    
                    <button className="btn-edit " type="button">
                      <p className="cursor">Edit Offer</p>
                    </button>
                  </div> */}
                </div>
            </div>
          </div>
        </>
      )}

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
