import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { baseUrl } from "config.js";

import { UserToken } from "Context/userToken";
import ReadOnly from "components/Forms/Shared/ReadOnly";


import MediaPopUp from "components/Helpers/MediaPopUp/MediaPopUp";
import DisplayMultiImages from "components/Shared/Dashboards/DisplayMultiImages";

import { useNavigate, useSearchParams } from "react-router-dom";

// utils function
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import { getMonthName as getDate } from "utils/getMonthName";
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

  // utils function
  let getMonthName = getDate;

 

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
                <div className=" container-2-gap  p-0 bg-info">
                  <div className="container-profile-input w-100">
                    <div className="title-contianer-input w-100">
                      <p> Offer Details</p>
                      <div className="w-100 ">
                        <div className="row  row-gap">
                          <div className="col-6">
                          <ReadOnly
                    title="Product Name"
                    value={PosData?.productName}
                  />
                          </div>

                          <div className="col-6">
                          <ReadOnly
                    title="sku"
                    value={PosData?.sku}
                  />
                           
                          </div>

                          <div className="col-6">
                <ReadOnly title="hsnCode" value={PosData?.productHSNCode} />

                          
                          </div>

                          <div className="col-6">
              <ReadOnly title="Price" value={PosData?.price} />
            </div>
            <div className="col-6">
              <ReadOnly
                title="packing Conditions"
                value={PosData?.packingConditions}
              />
            </div>
            <div className="col-6">
              <ReadOnly
                title="quality Conditions"
                value={PosData?.qualityConditions}
              />
            </div>

            <div className="col-6">
              <ReadOnly
                title="shipping Conditions"
                value={PosData?.shippingConditions}
              />
            </div>

                        

                          <div className="col-6">
              <ReadOnly
                title="Delivery Terms"
                value={PosData?.deliveryTerms}
              />
            </div>


            <div className="col-6">
              <ReadOnly
                title="payment Terms"
                value={PosData?.paymentTerms}
              />
            </div>

            <div className="col-6">
              <ReadOnly
                title="available"
                value={ PosData?.available
                  ? "In Stock"
                  : "Out Of Stock"}
              />
            </div>

                        

                        
                  <div className="col-6">
                    <ReadOnly
                      title="preferred Countries"
                      value={`${PosData?.preferredCountries?.join(", ") ||
                        "All"}  `}
                    />
                  </div>

                       
                  <div className="col-md-6 col-sm-12">
                    <ReadOnly title="Quantity" value={PosData?.quantity} />
                  </div>


                       
                  <div className="col-md-6 col-sm-12">
                    <ReadOnly
                      title="Created At"
                      value={getMonthName(PosData?.createdAt?.split("T")?.[0])}
                    />
                  </div>

                          {/* ---------------------------- */}

                          
                  {PosData?.specialCharacteristics &&
                    Object?.keys(PosData?.specialCharacteristics)?.length >
                      0 && (
                      <div className="col-12 ">
                        <label className="fw-600 mb-1">
                          Product Characteristics
                        </label>

                        <div className="form-group form-control p-4 ">
                          <div className="row row-gap ">
                            {Object?.entries(
                              PosData?.specialCharacteristics
                            )?.map(([key, value], index) => (
                              <div className="col-6">
                                <ReadOnly title={key} value={value} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                          

<div className="col-12">
                    <ReadOnly
                      title="Product Description"
                      value={PosData?.productDescription}
                    />
                  </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="container-profile-input w-100">
                    <div className="title-contianer-input w-100">
                      <p> Product Images</p>
                      <DisplayMultiImages
                      handleImageClick={handleImageClick}
                      images={PosData?.images}
                    />

                      
                    </div>
                  </div>

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
