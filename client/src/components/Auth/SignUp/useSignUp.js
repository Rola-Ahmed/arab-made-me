import { useState,useContext } from "react";
import { addUser } from "Services/UserAuth.js";
import { UserToken } from "Context/userToken";
import { useNavigate } from "react-router-dom";

const useSignUp = () => {
  let { setIsLogin } = useContext(UserToken);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();


  async function submitForm(values) {
    setErrorMsg("");
      setIsLoading(true);
      let data = {
        email: values.email,
        password: values.password,
      };

      let result = await addUser(data);
      if (result?.success) {
        setIsLogin(result?.data?.token);
        navigate(`/userType`);
      } else {
        setErrorMsg(result?.error);
        window.scrollTo({ top: 0 });
      }
    setIsLoading(false);
  }
  return { submitForm,isLoading,errorMsg};
};

export default useSignUp;
