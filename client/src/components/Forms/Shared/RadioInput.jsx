import React from "react";

export default function RadioInput(props) {
  let { formValidation, vlaidationName, label, value, defaultChecked } = props;
  return (
    <>
      <input
        class="form-check-input"
        type="radio"
        id={vlaidationName}
        name={vlaidationName}
        onChange={formValidation.handleChange}
        onBlur={formValidation.handleBlur}
        value={value}
        defaultChecked={defaultChecked}
      />
      <label class="form-check-label">{label}</label>
    </>
  );
}
