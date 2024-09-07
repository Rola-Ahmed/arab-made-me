import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { addChat } from "Services/chat";

export default function SendMsg(props) {
  const [dataSent, setDataSent] = useState(false);
  const { recieverUserId, isLogin, SetNewMessageSuccess, setreqData } =
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
     
      // console.log("result?.data?.chat",result?.data?.chat)
      setDataSent(!dataSent);
      SetNewMessageSuccess({
        input: null,
        send: true,
      });
      formValidation.setValues(initialValues);
      setreqData((prevVal) => ({
        ...prevVal,
        ...result?.data?.chat,
      }));
   
    }
  }

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
