import { toast } from "react-toastify";

const ErrorToast = (msg) => {
  toast.success(msg, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    theme: "colored",
  });


//   toast("Something Went Wrong, please try Again Later", {
//     position: "top-center",
//     autoClose: 5000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     draggable: true,
//     theme: "colored",
//     type: "error",
//   });
};

export default ErrorToast;
