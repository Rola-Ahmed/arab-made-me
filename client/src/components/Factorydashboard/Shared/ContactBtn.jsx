  import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAllUserChats from "hooks/useAllUserChats";

export default function ContactBtn(props) {
  let { isLogin, recieverUserId } = props;
  const navigate = useNavigate();

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
      className=" btn-edit border-btn bg-white  "
      type="button"
      onClick={() => {
        if (currentChat != "") {
          navigate(
            `/factorydashboard/conversation?currentChat=${currentChat}`
          );
        } else {
          navigate(
            `/factorydashboard/newConversation?userId=${recieverUserId}`
          );
        }
      }}
    >
      <p className="cursor text-success text-dark ">Contact Buyer</p>
    </button>
  );
}
