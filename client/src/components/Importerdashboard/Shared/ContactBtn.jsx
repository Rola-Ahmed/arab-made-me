
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAllUserChats from "hooks/useAllUserChats";


export default function ContactBtn(props) {
  let { isLogin, recieverUserId } = props;
  let navigate=useNavigate()

  let [currentChat, setCurrentChat] = useState("");
 let { reqData }=useAllUserChats(isLogin)



  async function fetchConversationExisit() {
    
        const matchedObject = reqData?.find(
          (obj) => obj?.userTwoId == recieverUserId
        );

        if (matchedObject) {
          setCurrentChat(matchedObject?.id);
        }
      
  }

  useEffect(() => {
    fetchConversationExisit();
  }, [recieverUserId,reqData]);

  return (
    <button
      className="btn-edit mb-5 "
      type="button"
      onClick={() => {
        if (currentChat != "") {
          navigate(
            `/importerdashboard/conversation?currentChat=${currentChat}`
          );
        } else {
          navigate(
            `/importerdashboard/newConversation?userId=${recieverUserId}`
          );
        }
      }}
    >
      <p className="cursor ">Contact Supplier</p>
    </button>
  );
}
