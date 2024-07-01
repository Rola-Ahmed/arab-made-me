import React from "react";

export default function FormVlaidtionError(props) {
  let { formValidation, vlaidationName } = props;
  return (
    <>
      {formValidation.errors[vlaidationName] &&
      formValidation.touched[vlaidationName] ? (
        <small className="form-text text-danger">
          {formValidation.errors[vlaidationName]}
        </small>
      ) : (
        ""
      )}
    </>
  );
}
