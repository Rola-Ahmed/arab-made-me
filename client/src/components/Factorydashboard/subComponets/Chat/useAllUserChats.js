import { useContext } from "react";
import { useEffect, useState } from "react";
import { getChatsForUser } from "Services/chat";
import { getUser } from "Services/UserAuth";
import { socket } from "config.js";
import { userDetails } from "Context/userType";
import { fetchOneFactory } from "Services/factory";
import { fetchOneImporter } from "Services/importer";

const useAllUserChats = (isLogin, filter) => {
  let { currentUserData } = useContext(userDetails);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    displayProductSize: 8,
    totalPage: 1,
  });

  const [apiLoadingData, setApiLoadingData] = useState(true);
  const [reqData, setReqData] = useState([]);
  const [errorsMsg, setErrorsMsg] = useState("");
  const [uniqueFactoryIDofProducts, setUniqueFactoryIDofProducts] = useState(
    []
  );

  // -------------------------------------------
  // Get chat Length
  // -------------------------------------------
  const fetchReqLeng = async () => {
    const params = `formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`;
    const result = await getChatsForUser(params, { authorization: isLogin });

    if (result?.success) {
      const totalReq = result.data?.chats?.length || 1;
      setPagination((prevValue) => ({
        ...prevValue,
        totalPage: Math.ceil(totalReq / prevValue.displayProductSize),
      }));
    }
  };

  // -------------------------------------------
  // Get chat Data Phase 1
  // -------------------------------------------
  const fetchReqData = async () => {
    // why added SetTimeOut? inorder for the user to see that the data has changes when using filtter or seach
    // bec sometime it returns the same data
    setApiLoadingData(true);
    setReqData([]);
    const params = `size=${pagination.displayProductSize}&page=${pagination.currentPage}&formsFilter=${filter?.formsFilter}&sort=${filter?.sort}`;
    const result = await getChatsForUser(params, { authorization: isLogin });

    if (result?.success) {
      setReqData(result?.data?.chats);
      setTimeout(() => {
        setReqData(result?.data?.chats);
      }, 50);

      // extract other side user ids
      // inorder to get their names and & emails
      const uniqueIds = [
        ...new Set(
          result?.data?.chats
            .map((obj) =>
              currentUserData?.userID != obj?.userTwoId
                ? obj?.userTwoId
                : obj?.userOneId
            )
            .filter(Boolean) // Remove any null or undefined values
        ),
      ];

      setUniqueFactoryIDofProducts(uniqueIds);
    } else {
      setErrorsMsg(result?.error);
    }
    setTimeout(() => {
      setApiLoadingData(false);
    }, 50);
  };

  useEffect(() => {
    fetchReqLeng();
  }, [filter, isLogin]);

  useEffect(() => {
    fetchReqData();
  }, [pagination.currentPage, pagination?.totalPage, filter, isLogin]);

  useEffect(() => {
    // Promise.all(
    uniqueFactoryIDofProducts.map(async (item) => {
      const result = await getUser(item);
      console.log("result");
      if (result?.success) {
        // check user role inorder to call the exra data from the factory/impoter endpoint
        if (result.data.users?.importerId) {
          fetchImporter(result.data.users?.importerId, item);
        } else {
          fetchFactory(result.data.users?.factoryId, item);
        }
      }
    });
  }, [apiLoadingData]);

  const fetchImporter = async (id, userId) => {
    const response = await fetchOneImporter(id);

    if (response?.success) {
      setReqData((prevState) =>
        prevState.map((value, index) => {
          console.log(
            "value?.importerrrrrr------",
            value?.userTwoId,
            value?.userOneId,
            userId
          );
          // Return the updated value if condition is met, otherwise return the original value
          return value?.userTwoId == userId || value?.userOneId == userId
            ? {
                ...value,
                UserTwoName: response.data.importers.repName,
                UserTwoEmail: response.data.importers.repEmail,
                UserTwoImage: response.data.importers.image,
                UserTwoDescription: response.data.importers.description,
              }
            : value;
        })
      );
    }
  };

  const fetchFactory = async (id, userId) => {
    const response = await fetchOneFactory(id);

    if (response?.success) {
      setReqData((prevState) =>
        prevState.map((value, index) => {
          console.log("value?.factory------", value?.userTwoId, id, userId);

          // Return the updated value if condition is met, otherwise return the original value
          return value?.userTwoId == userId || value?.userOneId == userId
            ? {
                ...value,
                UserTwoName: response.data.factories.repName,
                UserTwoEmail: response.data.factories.repEmail,
                UserTwoImage: response.data.factories.coverImage,
                UserTwoDescription: response.data.factories.description,
              }
            : value;
        })
      );
    }
  };

  console.log("reqData", reqData);
  useEffect(() => {
    if (isLogin) {
      const connectSocket = () => {
        // socket.connect();

        socket.on("connect", () => {
          console.log("Connected to server");
        });

        socket.on("newMessage", (data) => {
          fetchReqData();
          // setReqData((prevData) =>
          //   prevData.map((value) =>
          //     value?.userTwoId === data.messageObj.receiver
          //       ? {
          //           ...value,
          //           message: [...value.message, data.messageObj],
          //         }
          //       : value
          //   )
          // );
          console.log("newMessage", reqData);
        });

        socket.on("socketAuth", (data) => {});

        socket.on("connect_error", (err) => {
          console.log("Error", err);
        });

        socket.on("connect_timeout", (err) => {
          console.log("Error", err);
        });

        socket.on("error", (err) => {
          console.log("Error", err);
        });

        socket.on("reconnect_error", (err) => {
          console.log("Error", err);
        });

        socket.on("reconnect_failed", () => {
          console.log("connectionfails");
        });

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

  return { reqData, pagination, apiLoadingData, errorsMsg, setPagination };
};

export default useAllUserChats;
