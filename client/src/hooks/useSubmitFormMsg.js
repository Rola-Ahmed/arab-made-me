// import { useCallback, useContext } from "react";
import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { GlobalMsgContext } from "Context/globalMessage";
import SuccessToast from "components/SuccessToast";

const useSubmitFormMsg = () => {
  
  // let { setGlobalMsg } = useContext(GlobalMsgContext);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = useCallback(
    (message) => {
      const hasPreviousState = location.key !== "default";

      SuccessToast(`Your ${message} Form has been successfully submitted`);
      // setGlobalMsg(`Your ${message} Form has been successfully submitted`);

      if (hasPreviousState) {
        navigate(-1); // Navigate back
      } else {
        navigate("/");
      }
    },
    [navigate]
  );

  return handleSubmit;
};

export default useSubmitFormMsg;
