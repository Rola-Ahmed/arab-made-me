import { useEffect, useState } from "react";
import { getChatsForUser } from "Services/chat";
import { getUser } from "Services/UserAuth";
import { socket } from "config.js";

const useAllUserChats = (isLogin, filter) => {
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

      const uniqueIds = [
        ...new Set(
          result?.data?.chats.map(
            (obj) => obj.userTwoId // Extract all factoryIds
          ) // Filter out null values
        ),
      ];

      setUniqueFactoryIDofProducts(uniqueIds);
    } else {
      setErrorsMsg(result?.error);
    }
    // setApiLoadingData(false);

    setTimeout(() => {
      setApiLoadingData(false);
    }, 50);
  };

  useEffect(() => {
    fetchReqLeng();
  }, [filter, isLogin]);

  useEffect(() => {
    fetchReqData();

    // pagination?.currentPage,
    // pagination?.totalPage,
    // dataFilterFromChild,
    // isLogin,
  }, [pagination.currentPage, pagination?.totalPage, filter, isLogin]);

  useEffect(() => {
    // Promise.all(
    uniqueFactoryIDofProducts.map(async (item) => {
      const result = await getUser(item);
      if (result?.success) {
        setReqData((prevData) =>
          //   loop on the array
          prevData.map((value) =>
            value?.userTwoId === item
              ? {
                  ...value,
                  userName: result?.data?.users?.name?.join(" "),
                  userEmail: result?.data?.users?.email,
                }
              : value
          )
        );
      }
    });
  }, [apiLoadingData]);

  useEffect(() => {
    if (isLogin) {
      const connectSocket = () => {
        // socket.connect();

        socket.on("connect", () => {
          // console.log("Connected to server");
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
          // console.log("reqDatareqDatareqData", reqData);
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

  return { reqData, pagination, apiLoadingData, errorsMsg, setPagination };
};

export default useAllUserChats;
