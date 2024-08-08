import { useEffect, useState, useRef } from "react";
import { handleImageError } from "utils/ImgNotFound";
// shared components
import { baseUrl_IMG } from "config.js";
import SubPageUtility from "components/Shared/Dashboards/PageUtility";
import { getTimeDifference as getTimeDiff } from "utils/getTimeDifference";
import SendMsg from "components/Importerdashboard/subComponets/Chat/Converstaion/SendMsg"
import useConversationBetweenUsers from "hooks/useConversationBetweenUsers";

export default function Conversation() {
  let {
    reqData,
    apiLoadingData,
    errorsMsg,
    currentUserData,
    setReqData,
    isLogin,
  } = useConversationBetweenUsers();
  let getTimeDifference = getTimeDiff;
  const scrollChat = useRef(null);
  const [newMessageSuccess, SetNewMessageSuccess] = useState({
    input: null,
    send: false,
  });

  useEffect(() => {
    if (scrollChat.current) {
      scrollChat.current.scrollTop = scrollChat.current.scrollHeight;
    }
  }, [reqData]);

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
                  src={`${baseUrl_IMG}/${reqData.UserTwoImage}`}
                  alt={`${baseUrl_IMG}/${reqData.UserTwoImage}`}
                />
              </div>
              <div className="d-grid gap-1 h-fit-content">
                <h3 className="m-0  lh-normal">{reqData?.UserTwoName}</h3>
                <p className=" email-text-2 lh-normal">
                  {reqData?.UserTwoEmail}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* </div> */}
        {/* data section */}

        <div className=" h-100  cont-23" ref={scrollChat}>
          <div className="row">
            <div className="col-8">
              <div className="cont-chat-3">
                {reqData?.messages?.map((poItem) => (
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
                            {getTimeDifference(reqData?.createdAt)}

                            <i class="fa-solid fa-check-double text-muted my-auto ms-2"></i>
                          </small>
                        </div>
                      </>
                    ) : (
                      <div className="gap-16 justify-content-start align-items-start d-grid cont-mssg-parent">
                        <div className="profile-img-3 ">
                          <img
                            className="w-100 h-100"
                            src={`${baseUrl_IMG}/${reqData.UserTwoImage}`}
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
                            {getTimeDifference(reqData?.createdAt)}
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
                      {getTimeDifference(reqData?.createdAt)}

                      {newMessageSuccess?.send ? (
                        <i class="fa-solid fa-check-double text-muted my-auto ms-2"></i>
                      ) : (
                        <i class="fa-solid fa-check text-muted my-auto ms-2"></i>
                      )}
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
                        src={`${baseUrl_IMG}/${reqData.UserTwoImage}`}
                        onError={handleImageError}
                        alt="profile"
                      />
                    </div>
                  </div>
                </div>

                <div className="title-header-2 pad-decr-1">
                  <p className="fw-600 fs-24">{reqData?.UserTwoName}</p>
                  <p className=" fw-16 lh-normal">{reqData?.UserTwoEmail}</p>
                </div>

                <div className="describe-conv  pad-decr-1">
                  <p className="fw-16 fw-bold">About</p>
                  <p className="fw-16">{reqData?.UserTwoDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SendMsg
          setreqData={setReqData}
          SetNewMessageSuccess={SetNewMessageSuccess}
          recieverUserId={
            reqData?.userTwoId != currentUserData?.userID
              ? reqData?.userTwoId
              : reqData?.userOneId
          }
          isLogin={isLogin}
        />
      </div>
    </div>
  );
}
