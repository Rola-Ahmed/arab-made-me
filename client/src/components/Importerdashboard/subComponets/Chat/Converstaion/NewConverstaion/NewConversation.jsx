import { useEffect, useState, useContext } from "react";
import { handleImageError } from "utils/ImgNotFound";
// shared components
import axios from "axios";
import { baseUrl, baseUrl_IMG } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";


import { useSearchParams } from "react-router-dom";
import SubPageUtility from "components/Shared/Dashboards/PageUtility";
import { getTimeDifference as getTimeDiff } from "utils/getTimeDifference";
import SendMsg from "./SendMsg";

export default function Conversation() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  let getTimeDifference = getTimeDiff;

  const [allPosData, setAllPosData] = useState({});
  const [newMessageSuccess, SetNewMessageSuccess] = useState({
    input: null,
    send: false,
  });

  // utils function

  useEffect(() => {
    fetchUserTwo(userId);
  }, [userId]);

  const fetchUserTwo = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/users/${id}`);

      if (response.data.message === "done") {
        if (response.data.users?.importerId != null) {
          // setAllPosData((prevValue) => ({
          //   ...prevValue,
          //   UserTwoFacOrImpID: response.data.users?.importerId,
          // }));
          fetchUserTwoImporter(response.data.users?.importerId);
        } else {
          fetchUserTwoFactory(response.data.users?.factoryId);
        }
      }
    } catch (error) {
      // console.error("Error fetching data", error);
    }
  };
  const fetchUserTwoImporter = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/importers/${id}`);

      if (response.data.message === "done") {
        setAllPosData((prevValue) => ({
          ...prevValue,
          UserTwoName: response.data.importers.repName,
          UserTwoEmail: response.data.importers.repEmail,
          UserTwoImage: response.data.importers.image,
          UserTwoDescription: response.data.importers.description,
        }));
      }
    } catch (error) {
      // console.error("Error fetching data", error);
    }
  };

  const fetchUserTwoFactory = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/factories/${id}`);

      if (response.data.message === "done") {
        setAllPosData((prevValue) => ({
          ...prevValue,
          UserTwoName: response.data.factories.repName,
          UserTwoEmail: response.data.factories.repEmail,
          UserTwoImage: response.data.factories.coverImage,
          UserTwoDescription: response.data.factories.description,
        }));
      }
    } catch (error) {}
  };

  return (
    <div className="m-4 order-section overflow-hidden ">
      {/* section 1 */}
      <div className="header w-100">
        <div className="p-0 m-0 sticky-header">
          <SubPageUtility currentPage="Conversation" PrevPage="Messages" />
        </div>
        <div>
          <div className=" d-flex justify-content-between align-items-center border-bottom ">
            <div className="gap-8 justify-content-start align-items-start d-flex">
              <div className="conv-img-2">
                <img
                  className="w-100 h-100"
                  src={`${baseUrl_IMG}/${allPosData?.UserTwoImage}`}
                  onError={handleImageError}
                />
              </div>
              <div className="d-grid gap-1 h-fit-content">
                <h3 className="m-0  lh-normal">{allPosData?.UserTwoName}</h3>
                <p className=" email-text-2 lh-normal">
                  {allPosData?.UserTwoEmail}
                </p>
              </div>
            </div>
            {/* <h2 className="m-0 ">Messages</h2> */}
          </div>
        </div>

        {/* </div> */}
        {/* data section */}

        <div className=" h-100  cont-23">
          <div className="row">
            <div className="col-8">
              <div className="cont-chat-3">
                {allPosData?.messages?.map((poItem) => (
                  // <>{poItem?.sender}</>
                  <>
                    {poItem?.sender == currentUserData?.userID ? (
                      <>
                        <div className=" justify-content-end align-items-start d-grid ">
                          <div className="d-grid gap-1 h-fit-content single-msg right">
                            <p className=" fs-16 lh-normal text-white">
                              {poItem?.message}
                            </p>
                          </div>
                          <small className="d-flex justify-content-end text-muted fs-12 ">
                            {getTimeDifference(allPosData?.createdAt)}

                            <i class="fa-solid fa-check-double text-muted my-auto ms-2"></i>
                            {/* {allPosData?.createdA} */}
                          </small>
                        </div>
                      </>
                    ) : (
                      <div className="gap-16 justify-content-start align-items-start d-grid cont-mssg-parent">
                        <div className="profile-img-3 ">
                          <img
                            className="w-100 h-100"
                            src={`${baseUrl_IMG}/`}
                            onError={handleImageError}
                          />
                        </div>
                        <div className="w-fit-content">
                          <div className="d-grid gap-1 h-fit-content single-msg left">
                            <p className=" fs-16 lh-normal">
                              {poItem?.message}
                            </p>
                          </div>
                          <small className="d-flex justify-content-end text-muted fs-12 ">
                            {getTimeDifference(allPosData?.createdAt)}
                            {/* {allPosData?.createdA} */}
                          </small>
                        </div>
                      </div>
                    )}
                  </>
                ))}

                {newMessageSuccess?.input != null && (
                  <div className=" justify-content-end align-items-start d-grid ">
                    <div className="d-grid gap-1 h-fit-content single-msg right">
                      <p className=" fs-16 lh-normal text-white">
                        {newMessageSuccess?.input}
                      </p>
                    </div>
                    <small className="d-flex justify-content-end text-muted fs-12 ">
                      {getTimeDifference(allPosData?.createdAt)}

                      {newMessageSuccess?.send ? (
                        <i class="fa-solid fa-check-double text-muted my-auto ms-2"></i>
                      ) : (
                        <i class="fa-solid fa-check text-muted my-auto ms-2"></i>
                      )}
                      {/* {allPosData?.createdA} */}
                    </small>
                  </div>
                )}
              </div>
            </div>

            <div className="sticky-2 col-4">
              <div className="cover-2">
                <div className="position-relative">
                  <div className="bg-header-dash"></div>
                  <div className="position-absolute header-img">
                    <div className="img-cont-chat">
                      <img
                        className="w-100 h-100"
                        src={`${baseUrl_IMG}/${allPosData?.UserTwoImage}`}
                        onError={handleImageError}
                        alt="profile"
                      />
                    </div>
                  </div>
                </div>

                <div className="title-header-2 pad-decr-1">
                  <p className="fw-600 fs-24">{allPosData?.UserTwoName}</p>
                  <p className=" fw-16 lh-normal">{allPosData?.UserTwoEmail}</p>
                </div>

                <div className="describe-conv  pad-decr-1">
                  <p className="fw-16 fw-bold">About</p>
                  <p className="fw-16">{allPosData?.UserTwoDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className=" data-container w-100 p-3">
          <div></div>
        </div> */}

        <SendMsg
          SetNewMessageSuccess={SetNewMessageSuccess}
          recieverUserId={userId}
          isLogin={isLogin}
        />
      </div>
    </div>
  );
}
