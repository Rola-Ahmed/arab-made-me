import { useContext, useEffect, useState } from "react";
import { userDetails } from "Context/userType";
import { useSearchParams } from "react-router-dom";
import { socket } from "config.js";
import { getChatBetweenTwo } from "Services/chat";
import { getUser } from "Services/UserAuth";
import { fetchOneFactory } from "Services/factory";
import { fetchOneImporter } from "Services/importer";
import { UserToken } from "Context/userToken";

const useConversationBetweenUsers = () => {
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  const [searchParams] = useSearchParams();
  const currentChat = searchParams.get("currentChat");

  const [apiLoadingData, setApiLoadingData] = useState(true);
  const [reqData, setReqData] = useState([]);
  const [errorsMsg, setErrorsMsg] = useState("");

  // -------------------------------------------
  // Get conversation between 2 users
  // -------------------------------------------
  async function fetchReqData() {
    setApiLoadingData(true);

    let result = await getChatBetweenTwo(
      currentChat,
      {},
      {
        authorization: isLogin,
      }
    );

    if (result?.success) {
      setReqData((prevValue) => ({
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
    setApiLoadingData(false);
  }

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
      setReqData((prevValue) => ({
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
      setReqData((prevValue) => ({
        ...prevValue,
        UserTwoName: response.data.factories.repName,
        UserTwoEmail: response.data.factories.repEmail,
        UserTwoImage: response.data.factories.coverImage,
        UserTwoDescription: response.data.factories.description,
      }));
    }
  };

  useEffect(() => {
    fetchReqData();
  }, [currentChat, currentUserData && currentUserData?.userID]);
  // -------------------------------------------
  // Get chat Data Phase 1
  // -------------------------------------------

  useEffect(() => {
    if (isLogin) {
      const connectSocket = () => {
        // socket.connect();

        socket.on("connect", () => {
          console.log("Connected to server");
        });

        socket.on("newMessage", (data) => {
          console.log("data",data)
          fetchReqData();
        });

        socket.on("socketAuth", (data) => {});

        socket.on("connect_error", (err) => {});

        socket.on("connect_timeout", (err) => {});

        socket.on("error", (err) => {});

        socket.on("reconnect_error", (err) => {});

        socket.on("reconnect_failed", () => {});

        // Cleanup on unmount
        return () => {
          // socket.off("connect");
          // socket.off("newMessage");
          // socket.off("authorization");
          // socket.off("connect_error");
          // socket.off("connect_timeout");
          // socket.off("error");
          // socket.off("reconnect_error");
          // socket.off("reconnect_failed");
          // socket.disconnect();
        };
      };

      connectSocket();

      return () => {
        // console.log("Disconnecting socket..."); // Debugging message
        // socket.disconnect();
      };
    }
  }, [isLogin]);

  return {
    isLogin,
    reqData,
    apiLoadingData,
    errorsMsg,
    currentUserData,
    setReqData,
  };
};

export default useConversationBetweenUsers;
