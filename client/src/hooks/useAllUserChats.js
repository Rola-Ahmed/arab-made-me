import { useContext } from "react";
import { useEffect, useState } from "react";
import { getChatsForUser } from "Services/chat";
import { getUser } from "Services/UserAuth";
import { socket } from "config.js";
import { userDetails } from "Context/userType";
import { fetchOneFactory } from "Services/factory";
import { fetchOneImporter } from "Services/importer";

const useAllUserChats = (isLogin) => {
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
    const result = await getChatsForUser({}, { authorization: isLogin });

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
    const result = await getChatsForUser("include=userOne&include=userOne", {
      authorization: isLogin,
    });
    console.log("result", result);
    if (result?.success) {
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
  }, [isLogin]);

  useEffect(() => {
    fetchReqData();
  }, [pagination.currentPage, pagination?.totalPage, isLogin]);

  useEffect(() => {
    // Promise.all(
    uniqueFactoryIDofProducts?.map(async (item) => {
      const result = await getUser(item);
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
          // Return the updated value if condition is met, otherwise return the original value
          return value?.userTwoId == userId || value?.userOneId == userId
            ? {
                ...value,
                UserTwoName: response.data.importers.repName,
                UserTwoId: response.data.importers.userId,
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
          // Return the updated value if condition is met, otherwise return the original value
          return value?.userTwoId == userId || value?.userOneId == userId
            ? {
                ...value,
                UserTwoName: response.data.factories.repName,
                UserTwoId: response.data.factories.userId,

                UserTwoEmail: response.data.factories.repEmail,
                UserTwoImage: response.data.factories.coverImage,
                UserTwoDescription: response.data.factories.description,
                UserTwoFactoryName: response.data.factories.name,
              }
            : value;
        })
      );
    }
  };

  useEffect(() => {
    if (isLogin) {
      // console.log("isLogin",isLogin)
      const connectSocket = () => {
        socket.connect();
        socket.emit("socketAuth", isLogin);

        socket.on("connect", () => {
          console.log("Connected to server");
        });

        // socket.on("newMessage", (data) => {
        //   // console.log("newMessage data", data, data?.sender);
        //   // fetchReqData();
        //   console.log("newMessage before", reqData);

        //   const updatedReqData = reqData?.map((item) => {
        //     if (item?.UserTwoId == data?.sender) {
        //       console.log(":if item", item);

        //       // If condition is true, push new message to the messages array
        //       return {
        //         ...item,
        //         messages: [...item?.messages, data], // Assuming messages is an array
        //       };
        //     } else {
        //       console.log(":else item", item);
        //       // If condition is false, return the item unchanged
        //       return item;
        //     }
        //   });
        //   console.log("newMessage updatedReqData", reqData, updatedReqData);

        //   // Finally, update the state with the new array
        //   setReqData(updatedReqData);

        //   // reqData?.map((item) =>
        //   //   //  console.log("item,item", item?.id)
        //   //   item?.UserTwoId == data?.sender
        //   //     ? console.log(
        //   //         " item?.userTwoId==29 true",
        //   //         item?.UserTwoId,
        //   //         data?.sender
        //   //       )
        //   //     : console.log(
        //   //         " item?.userTwoId==29 false",
        //   //         item?.UserTwoId,
        //   //         data?.sender
        //   //       )
        //   // );

        //   // reqData.forEach((chat) => {
        //   //   console.log(` item Chat ID: ${chat.id}`);
        //   //   console.log(`Created At: ${chat.createdAt}`);
        //   //   console.log(`User One ID: ${chat.userOneId}`);
        //   //   console.log(`Number of Messages: ${chat.messages.length}`);
        //   // });
        // });

        socket.on("newMessage", (data) => {
          // Log incoming message data
          console.log("newMessage data", data, data?.sender);

          // Use functional update to ensure you're working with the latest reqData state
          setReqData((prevReqData) => {
            // Log the previous state
            console.log("newMessage before", prevReqData);

            // Map over prevReqData and update it
            const updatedReqData = prevReqData?.map((item) => {
              if (item?.UserTwoId === data?.sender) {
                console.log(":if item", item);

                // If condition is true, push new message to the messages array
                return {
                  ...item,
                  messages: [...item?.messages, data], // Assuming messages is an array
                };
              } else {
                console.log(":else item", item);
                // If condition is false, return the item unchanged
                return item;
              }
            });

            console.log(
              "newMessage updatedReqData",
              prevReqData,
              updatedReqData
            );

            // Return the updated array to set the new state
            return updatedReqData;
          });
        });

        socket.on("socketAuth", (data) => {
          console.log("socketAuth data", data);
        });

        socket.on("connect_error", (err) => {
          console.log("connect_error,", err);
        });

        socket.on("connect_timeout", (err) => {
          console.log("connect_error", err);
        });

        socket.on("error", (err) => {
          console.log("error", "err", err);
        });

        socket.on("reconnect_error", (err) => {
          console.log("reconnect_error", err);
        });

        socket.on("reconnect_failed", (err) => {
          // console.log(err);
        });
        socket.on("connect_error", (err) => {
          console.error("Socket connection error:", err.message);
        });

        socket.on("connect_timeout", (err) => {
          console.error("Socket connection timeout:", err.message);
        });

        socket.on("error", (err) => {
          console.error("Socket error:", err.message);
        });

        // Add logs for other events as needed...

        // Cleanup on unmount
        return () => {
          socket.off("connect");
          socket.off("newMessage");
          socket.off("authorization");
          socket.off("connect_error");
          socket.off("connect_timeout");
          socket.off("error");
          socket.off("reconnect_error");
          socket.off("reconnect_failed");
          socket.disconnect();
        };
      };

      connectSocket();
    }
  }, [isLogin]);

  console.log("her0e", reqData);

  // reqData?.map((item) =>
  //   item?.userTwoId == 29
  //     ? console.log(" item?.userTwoId==29", item?.userTwoId == 29)
  //     : console.log(" item?.userTwoId==29 false")
  // );

  return { reqData, pagination, apiLoadingData, errorsMsg, setPagination };
};

export default useAllUserChats;
