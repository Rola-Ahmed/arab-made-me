import { useState,useContext } from "react";
import { addSignIn } from "Services/UserAuth.js";
import { UserToken } from "Context/userToken";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const useSignIn = () => {
  let params = useParams();
  const location = useLocation();

  let { setIsLogin } = useContext(UserToken);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);



  const searchParams = new URLSearchParams(location?.search);

  // Resulting query string will be "?factoryId=3&factoryName=samsung"
  if (searchParams?.size != 0) {
    const queryString = searchParams?.toString();
    params = `${params["*"]}?${queryString}`;
  }
  // console.log("params", params, params["*"]);


  let navigate = useNavigate();


  async function submitForm(values) {
    setErrorMsg("");
      setIsLoading(true);
      let data = {
        email: values.email,
        password: values.password,
      };

      let result = await addSignIn(data);
      if (result?.success) {
        setIsLogin(result?.data?.token);

      //1st if condition  means there is a redirect page that needs sign in first
      // the other else conditons means that its only sign in && user is directed to a specific path based on his type
      if (params !== null && params !== undefined && params["*"] != "") {
        // console.log("params if", params);
        navigate(`/${params["*"]}`);
      } else if (result?.data?.user?.factoryId !== null) {
        navigate(`/factorydashboard`);
      } else if (result?.data?.user?.role == "admin") {
        navigate(`/admin/adminDashboard`);
      } else {
        navigate("/");
      }
      } else {
        setErrorMsg(result?.error);
      }
    setIsLoading(false);
  }
  return { submitForm,isLoading,errorMsg};
};

export default useSignIn;
