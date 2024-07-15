import { useEffect, useState, useContext } from "react";
import "./sourcingh.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Carousel from "react-grid-carousel";
import { UserToken } from "Context/userToken";
import SourcingRequestCard from "components/Sourcinghub/SourcingRequest/SourcingRequestCard";

import { userDetails } from "Context/userType";
import { baseUrl } from "config.js";
import IsLoggedIn from "components/ActionMessages/IsLoggedInMsg";

import UserNotAuthorized from "components/ActionMessages/FormAccessControl/PopupMsgNotUserAuthorized";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedPopUpMsg";

import SourcingOffers from "components/Home/SourcingOffers/SourcingOffers";

function Sourcingh() {
  // utils function
  let { currentUserData } = useContext(userDetails);
  let { isLogin } = useContext(UserToken);

  const [allSourcingReqData, setAllSourcingReqData] = useState([]);
  const [uniqueFactoryIDofProducts, setUniqueFactoryIDofProducts] = useState(
    []
  );
  const [apiLoadingData, setApiLoadingData] = useState(true);
  const displayProductSize = 20;

  const [modalShow, setModalShow] = useState({
    isFactoryVerified: false,
    isImporterVerified: false,
    BecomeAfactory: false,
  });

  async function fetchSourcingReqData() {
    setApiLoadingData(true);

    try {
      let config = {
        method: "get",
        url: `${baseUrl}/sourcingRequests/?size=${displayProductSize}`,
      };

      const response = await axios.request(config);
      setAllSourcingReqData(response.data?.sourcingrequests);
      const uniqueIds = [
        ...new Set(
          response.data?.sourcingrequests
            .map((obj) => obj.importerId) // Extract all factoryIds
            .filter((id) => id !== null) // Filter out null values
        ),
      ];

      setUniqueFactoryIDofProducts(uniqueIds);
      setApiLoadingData(false);
    } catch (error) {
      setApiLoadingData(true);
    }
  }

  useEffect(() => {
    fetchSourcingReqData();
  }, []);

  useEffect(() => {
    // Promise.all(
    uniqueFactoryIDofProducts.map(async (importerID) => {
      try {
        const productResponse = await axios.get(
          `${baseUrl}/importers/${importerID}`
        );

        if (productResponse.data.message === "done") {
          setAllSourcingReqData((prevData) =>
            prevData.map((value) =>
              value?.importerId === importerID
                ? {
                    ...value,
                    importerName: productResponse?.data?.importers?.name,
                  }
                : value
            )
          );
        }
      } catch (error) {}
    });
  }, [apiLoadingData]);

  return (
    <section className="margin-sm-screen">
      <IsLoggedIn
        show={modalShow.isLogin}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isLogin: false,
          }))
        }
        distination={`/sigin`}
      />

      <UserNotAuthorized
        show={modalShow.isImporterVerified}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isImporterVerified: false,
          }))
        }
        userType="Factory"
      />

      <FactoryUnVerified
        show={modalShow.isFactoryVerified}
        onHide={() =>
          setModalShow((prevVal) => ({
            ...prevVal,
            isFactoryVerified: false,
          }))
        }
        // userType="Factory"
      />

      <div className="container sourcing-h-hom">
        <h2 className="sourc-h-2">Sourcing Hub</h2>
        <p className="sourc-p pb-2">Buyer Requests</p>
        <div className="row row-home-sourcing ">
          <Carousel
            cols={3}
            rows={1}
            // gap={30}
            scrollSnap={true}
            loop
            showDots={false}
            hideArrow={false}
            responsiveLayout={[
              {
                breakpoint: 1199,
                cols: 2,
                // gap: 58,
              },
              {
                breakpoint: 1199,
                cols: 1,
                // gap: 58,
              },
            ]}
            arrowLeft={
              <div className="arrow-btn position-absolute   arrowLeft carousel">
                <i className="fa-solid fa-chevron-left"></i>
              </div>
            }
            arrowRight={
              <div className="arrow-btn position-absolute arrowRight carousel">
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            }
          >
            {allSourcingReqData?.map((item) => (
              <Carousel.Item>
                <SourcingRequestCard
                  item={item}
                  setModalShow={setModalShow}
                  isLogin={isLogin}
                  currentUserData={currentUserData}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>

        <SourcingOffers />
      </div>
    </section>
  );
}

export default Sourcingh;
