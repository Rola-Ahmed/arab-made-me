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
      socket.connect();
      socket.emit("socketAuth", isLogin);

  
      const handleNewMessage = (data) => {
        console.log("Received newMessage:", data);
        
        fetchReqData();
      };
  
      const handleSocketAuth = (data) => {
        console.log("Received socketAuth:", data);
      };
  
      const handleError = (err) => {
        console.error("Socket error:", err);
      };
  
      socket.on("connect", () => {
        console.log("Connected to server", socket?.id);
  
        socket.on("newMessage", handleNewMessage);
        socket.on("socketAuth", handleSocketAuth);
        socket.on("connect_error", handleError);
        socket.on("connect_timeout", handleError);
        socket.on("error", handleError);
        socket.on("reconnect_error", handleError);
        socket.on("reconnect_failed", handleError);
      });
  
      // Cleanup on unmount
      return () => {
        socket.off("connect");
        socket.off("newMessage", handleNewMessage);
        socket.off("socketAuth", handleSocketAuth);
        socket.off("connect_error", handleError);
        socket.off("connect_timeout", handleError);
        socket.off("error", handleError);
        socket.off("reconnect_error", handleError);
        socket.off("reconnect_failed", handleError);
        socket.disconnect();
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
