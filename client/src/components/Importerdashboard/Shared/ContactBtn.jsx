import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "config.js";
import { useNavigate } from "react-router-dom";


export default function ContactBtn(props) {
  let { isLogin, recieverUserId } = props;
  let navigate=useNavigate()

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
          navigate(
            `importerdashboard/conversation?currentChat=${currentChat}`
          );
        } else {
          navigate(
            `importerdashboard/newConversation?userId=${recieverUserId}`
          );
        }
      }}
    >
      <p className="cursor ">Contact Supplier</p>
    </button>
  );
}
