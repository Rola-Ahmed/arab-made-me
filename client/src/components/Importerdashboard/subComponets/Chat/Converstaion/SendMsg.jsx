import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { socket } from "config.js";
import { addChat } from "Services/chat";

export default function SendMsg(props) {
  const [dataSent, setDataSent] = useState(false);
  const { recieverUserId, isLogin, SetNewMessageSuccess, setAllPosData } =
    props;

  const validationSchema = Yup.object().shape({
    message: Yup.string().max(255, "Max length is 255"),
  });

  const initialValues = {
    reciever: recieverUserId,
    message: "",
  };

  useEffect(() => {
    formValidation.setValues(initialValues);
  }, [recieverUserId]);

  const formValidation = useFormik({
    initialValues,
    validationSchema,
    onSubmit: submitForm,
  });

  async function submitForm(values) {
    SetNewMessageSuccess({
      input: values.message,
      send: false,
    });
    const data = {
      messageObj: {
        reciever: values.reciever,
        message: values.message,
        status: "pending",
      },
    };

    let result = await addChat(
      {
        authorization: isLogin,
      },
      data
    );

    if (result?.success) {
      socket.emit("newMessage", data);
      setDataSent(!dataSent);
      SetNewMessageSuccess({
        input: null,
        send: true,
      });
      formValidation.setValues(initialValues);
      setAllPosData((prevVal) => ({
        ...prevVal,
        ...result?.data?.chat,
      }));
    }
  }

  useEffect(() => {
    if (isLogin) {
      socket.emit("socketAuth", isLogin);

      const connectSocket = () => {

        socket.connect();

        socket.on("connect", () => {
        });

        socket.on("newMessage", (data) => {
          // Update state or perform actions based on the new message
        });

        socket.on("socketAuth", (data) => {
          SetNewMessageSuccess((prev) => !prev);
        });

        socket.on("connect_error", (err) => {
        });

        socket.on("connect_timeout", (err) => {
        });

        socket.on("error", (err) => {
        });

        socket.on("reconnect_error", (err) => {
        });

        socket.on("reconnect_failed", () => {
        });

        // Cleanup on unmount or dependency change
        return () => {
          socket.off("connect");
          socket.off("newMessage");
          socket.off("socketAuth");
          socket.off("connect_error");
          socket.off("connect_timeout");
          socket.off("error");
          socket.off("reconnect_error");
          socket.off("reconnect_failed");
          socket.disconnect();
        };
      };

      const cleanup = connectSocket();

      return () => {
        cleanup();
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
        placeholder="Send message..."
        onChange={formValidation.handleChange}
        onBlur={formValidation.handleBlur}
        value={formValidation.values.message}
        id="message"
      />
      {formValidation.errors.message && formValidation.touched.message && (
        <small className="form-text text-danger d-block w-100">
          {formValidation.errors.message}
        </small>
      )}
      <button className="border-0 text-end" type="submit">
        Send
      </button>
    </form>
  );
}
