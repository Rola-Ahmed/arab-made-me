import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "config.js";

export default function ContactBtn(props) {
  let { isLogin, recieverUserId } = props;
  const navigate = useNavigate();

  let [currentChat, setCurrentChat] = useState("");

  // function handleIsLoggedInBtn(loginPath) {
  //   if (!isLogin) {
  //     setModalShow((prevVal) => ({
  //       ...prevVal,
  //       isLogin: true,
  //     }));

  //     setisLoggedReDirect(`/signIn/${loginPath}`);
  //     return;
  //   }

  //   navigate(`/${loginPath}`);
  // }

  async function fetchFactoriesData() {
    try {
      let config = {
        method: "get",
        url: `${baseUrl}/chats/user/chats`,
        headers: {
          authorization: isLogin,
        },
      };

      const response = await axios.request(config);

      if (response?.data?.message == "done") {
        const matchedObject = response.data.chats.find(
          (obj) => obj.userTwoId == recieverUserId
        );

        if (matchedObject) {
          setCurrentChat(matchedObject?.id);
        }
      } else {
      }
    } catch (error) {}
  }

  useEffect(() => {
    fetchFactoriesData();
  }, [recieverUserId]);

  return (
    <button
      className=" btn-edit border-btn bg-white  "
      type="button"
      onClick={() => {
        if (currentChat != "") {
          navigate(
            `/factorydashboard/conversation?currentChat=${currentChat}`
            // `contactsupplier?userId=${userId}&factoryName=${factoryName}`
          );
        } else {
          navigate(
            `/factorydashboard/newConversation?userId=${recieverUserId}`
            // `contactsupplier?userId=${userId}&factoryName=${factoryName}`
          );
        }
      }}
    >
      <p className="cursor text-success text-dark ">Contact Buyer</p>
    </button>
  );
}
