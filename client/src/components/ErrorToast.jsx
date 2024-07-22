import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ErrorToast = (msg) => {
  console.log("msg");
  toast(msg, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    theme: "colored",
    type: "error",
  });
};

export default ErrorToast;
