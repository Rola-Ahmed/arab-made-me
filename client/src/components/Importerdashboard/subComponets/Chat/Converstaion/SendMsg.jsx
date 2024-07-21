import { useState, useContext, useEffect } from "react";
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { baseUrl } from "config.js";
import { socket } from "config.js";

export default function SendMsg(props) {
  let [dataSent, SetDataSent] = useState(false);
  let { recieverUserId, isLogin, SetNewMessageSuccess, setAllPosData } = props;
  let validationSchema = Yup.object().shape({
    message: Yup.string()
      // .min(5, "min legnth is 5")
      // .required("Input field is Required")
      .max(255, "max legnth is 255"),
  });

  let initialValues = {
    // optional
    reciever: recieverUserId,
    message: "",
  };

  useEffect(() => {
    formValidation.setValues(initialValues);
  }, [recieverUserId]);

  let formValidation = useFormik({
    initialValues,
    validationSchema,
    onSubmit: submitForm,
  });

  async function submitForm(values) {
    SetNewMessageSuccess({
      input: values.message,
      send: false,
    });
    let data = {
      messageObj: {
        reciever: values.reciever,
        message: values.message,
        status: "pending",
      },
    };

    try {
      let config = {
        method: "post",
        url: `${baseUrl}/chats/add`,
        headers: {
          authorization: isLogin,
        },
        data: data,
      };

      // socket.emit("newMessage", data);

      const response = await axios.request(config);

      if (response.data.message == "done") {
        SetDataSent(!dataSent);
        SetNewMessageSuccess({
          input: null,
          send: true,
        });
        formValidation.setValues(initialValues);
        setAllPosData((preVal) => ({
          ...preVal,
          ...response.data.chat,
        }));
      } else {
        // setErrorMsg((prevErrors) => ({
        //   ...prevErrors,
        //   response: response?.data?.message,
        // }));
      }
    } catch (error) {}

    // useEffect(() => {
    // Join the chat room or handle the connection

    // }, []);
  }

  useEffect(() => {
    // console.log("dataSent", dataSent);
    if (isLogin) {
      socket.emit("socketAuth", isLogin);

      const connectSocket = () => {
        console.log("Attempting to connect socket..."); // Debugging message
        socket.connect();
        console.log("Socket state after connect:", socket); // Debugging message

        socket.on("connect", () => {
          console.log("Connected to server");
        });

        socket.on("newMessage", (data) => {
          console.log("New message received newMessage:", data);
        });
        socket.on("socketAuth", (data) => {
          console.log("New message received authorization:", data);
        });

        socket.on("connect_error", (err) => {
          console.error("Connection error:", err);
        });

        socket.on("connect_timeout", (err) => {
          console.error("Connection timeout:", err);
        });

        socket.on("error", (err) => {
          console.error("General error:", err);
        });

        socket.on("reconnect_error", (err) => {
          console.error("Reconnect error:", err);
        });

        socket.on("reconnect_failed", () => {
          console.error("Reconnect failed");
        });

        // Cleanup on unmount
        return () => {
          socket.off("connect");
          socket.off("newMessage");
          socket.off("authorization");
          socket.off("connect_error");
          socket.off("connect_timeout");
          socket.off("error");
          socket.off("reconnect_error");
          socket.off("reconnect_failed");
          socket.disconnect();
        };
      };

      connectSocket();

      return () => {
        // console.log("Disconnecting socket..."); // Debugging message
        socket.disconnect();
      };
    }
  }, [isLogin, dataSent]);
  return (
    <form
      className="text-area-2 position-relative"
      onSubmit={formValidation.handleSubmit}
    >
      <textarea
        className="input-text-1 p-3"
        rows="2"
        placeholder="send message......."
        onChange={formValidation.handleChange}
        onBlur={formValidation.handleBlur}
        value={formValidation.values.message}
        id="message"
      />
      {formValidation.errors.message && formValidation.touched.message ? (
        <small className="form-text text-danger d-block w-100">
          {formValidation.errors.message}
        </small>
      ) : (
        ""
      )}
      <button className="border-0 text-end" type="submit">
        Send
      </button>
    </form>
  );
}
