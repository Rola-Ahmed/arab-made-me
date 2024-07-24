import { useEffect, useState, useContext, useRef } from "react";
import { handleImageError } from "utils/ImgNotFound";
// shared components
import { baseUrl_IMG } from "config.js";

import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import { useSearchParams } from "react-router-dom";
import SubPageUtility from "components/Shared/Dashboards/PageUtility";
import { getTimeDifference as getTimeDiff } from "utils/getTimeDifference";
import SendMsg from "./SendMsg";
import { socket } from "config.js";
import { getChatBetweenTwo } from "Services/chat";

import { getUser } from "Services/UserAuth";
import { fetchOneFactory } from "Services/factory";
import { fetchOneImporter } from "Services/importer";

export default function Conversation() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  const [searchParams] = useSearchParams();
  const currentChat = searchParams.get("currentChat");
  let getTimeDifference = getTimeDiff;
  const scrollChat = useRef(null);

  const [allPosData, setAllPosData] = useState({});
  const [errorsMsg, setErrorsMsg] = useState();
  const [newMessageSuccess, SetNewMessageSuccess] = useState({
    input: null,
    send: false,
  });

  const [apiLoadingData, setapiLoadingData] = useState(true);

  // utils function

  async function fetchReqData() {
    setapiLoadingData(true);

    try {
      let result = await getChatBetweenTwo(
        currentChat,
        {},
        {
          authorization: isLogin,
        }
      );

      if (result?.success) {
        setAllPosData((prevValue) => ({
          ...prevValue,
          ...result.data.chats,
        }));

        if (result.data.chats?.userTwoId != currentUserData?.userID) {
          fetchUserTwo(result.data.chats?.userTwoId);
        } else {
          fetchUserTwo(result.data.chats?.userOneId);
        }
      } else {
        setErrorsMsg(result?.data?.message);
      }
      setapiLoadingData(false);
    } catch (error) {
      setapiLoadingData(false);
    }
  }

  useEffect(() => {
    fetchReqData();
  }, [currentChat, currentUserData && currentUserData?.userID]);

  const fetchUserTwo = async (userId) => {
    const response = await getUser(userId);
    // console.log("importerId",response.data.users?.importerId,response.data.users?.factoryId,response.data.users?.id,userId)

    if (response?.success) {
      if (response.data.users?.importerId) {
        fetchUserTwoImporter(response.data.users?.importerId);
      } else {
        fetchUserTwoFactory(response.data.users?.factoryId);
      }
    }
  };
  const fetchUserTwoImporter = async (id) => {
    const response = await fetchOneImporter(id);
    // console.log();
    if (response?.success) {
      setAllPosData((prevValue) => ({
        ...prevValue,
        UserTwoName: response.data.importers.repName,
        UserTwoEmail: response.data.importers.repEmail,
        UserTwoImage: response.data.importers.image,
        UserTwoDescription: response.data.importers.description,
      }));
    }
  };

  const fetchUserTwoFactory = async (id) => {
    const response = await fetchOneFactory(id);

    if (response?.success) {
      setAllPosData((prevValue) => ({
        ...prevValue,
        UserTwoName: response.data.factories.repName,
        UserTwoEmail: response.data.factories.repEmail,
        UserTwoImage: response.data.factories.coverImage,
        UserTwoDescription: response.data.factories.description,
      }));
    }
  };

  useEffect(() => {
    if (scrollChat.current) {
      scrollChat.current.scrollTop = scrollChat.current.scrollHeight;
    }
  }, [allPosData]);

  useEffect(() => {
    if (isLogin) {
      const connectSocket = () => {
        socket.connect();

        socket.on("connect", () => {});

        socket.on("socketAuth", (data) => {});

        socket.on("newMessage", (data) => {
          fetchReqData();
        });

        socket.on("connect_error", (err) => {
          console.error("Connection error:", err);
        });

        socket.on("connect_timeout", (err) => {
          console.error("Connection timeout:", err);
        });

        socket.on("error", (err) => {
          console.error("General error:", err);
        });

        socket.on("reconnect_error", (err) => {
          console.error("Reconnect error:", err);
        });

        socket.on("reconnect_failed", () => {
          console.error("Reconnect failed");
        });

        // ... other event listeners ...

        // Cleanup on unmount
        return () => {
          socket.off("connect");
          // socket.off("authorization"); // Ensure to remove the listener
          socket.off("connect_error");
          socket.off("newMessage");
          socket.disconnect();
          socket.off("connect_timeout");
          socket.off("error");
          socket.off("reconnect_error");
          socket.off("reconnect_failed");
          // ... other off events ...
        };
      };

      connectSocket();
      // fetchFactoriesData();

      return () => {
        socket.disconnect();
      };
    }
  }, [isLogin, allPosData]);

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
              <div className="conv-img-2 ">
                <img
                  className="w-100 h-100"
                  onError={handleImageError}
                  src={`${baseUrl_IMG}/${allPosData.UserTwoImage}`}
                  alt={`${baseUrl_IMG}/${allPosData.UserTwoImage}`}
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

        <div className=" h-100  cont-23" ref={scrollChat}>
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
                            src={`${baseUrl_IMG}/${allPosData.UserTwoImage}`}
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
                        src={`${baseUrl_IMG}/${allPosData.UserTwoImage}`}
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

        <SendMsg
          setAllPosData={setAllPosData}
          SetNewMessageSuccess={SetNewMessageSuccess}
          recieverUserId={
            allPosData?.userTwoId != currentUserData?.userID
              ? allPosData?.userTwoId
              : allPosData?.userOneId
          }
          isLogin={isLogin}
        />
      </div>
    </div>
  );
}
