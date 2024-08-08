import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "config.js";


export default function ContactBtn(props) {
  let { isLogin, handleIsLoggedInBtn, recieverUserId } = props;

  let [currentChat, setCurrentChat] = useState("");

  async function fetchConversationExisit() {
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
    fetchConversationExisit();
  }, [recieverUserId]);

  return (
    <button
      className="btn-edit mb-5 "
      type="button"
      onClick={() => {
        if (currentChat != "") {
          handleIsLoggedInBtn(
            `importerdashboard/conversation?currentChat=${currentChat}`
            // `contactsupplier?userId=${userId}&factoryName=${factoryName}`
          );
        } else {
          handleIsLoggedInBtn(
            `importerdashboard/newConversation?userId=${recieverUserId}`
            // `contactsupplier?userId=${userId}&factoryName=${factoryName}`
          );
        }
      }}
    >
      <p className="cursor ">Contact Supplier</p>
    </button>
  );
}
