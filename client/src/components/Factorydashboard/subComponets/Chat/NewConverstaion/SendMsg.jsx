import { useState, useContext, useEffect } from "react";
import * as Yup from "yup";
import axios from "axios";
import { useFormik } from "formik";
import { baseUrl } from "config.js";
import { useNavigate } from "react-router-dom";

export default function SendMsg(props) {
  let { recieverUserId, isLogin, SetNewMessageSuccess } = props;
  let navigate = useNavigate();
  let validationSchema = Yup.object().shape({
    message: Yup.string()
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

      const response = await axios.request(config);

      if (response.data.message == "done") {
        SetNewMessageSuccess({
          input: values.message,
          send: true,
        });
        navigate(
          `/factorydashboard/conversation?currentChat=${response?.data?.chat?.id}`
        );
        formValidation.setValues(initialValues);
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
