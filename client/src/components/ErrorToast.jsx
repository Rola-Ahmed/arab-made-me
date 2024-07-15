import { toast } from "react-toastify";

const ErrorToast = (msg) => {
  toast(msg, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    theme: "colored",
    type: "success",
  });
};

export default ErrorToast;
