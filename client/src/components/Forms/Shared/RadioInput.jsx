export default function RadioInput(props) {
  let { formValidation, vlaidationName, label, value, defaultChecked } = props;
  return (
    <>
      <input
        className="form-check-input"
        type="radio"
        id={vlaidationName}
        name={vlaidationName}
        onChange={formValidation.handleChange}
        onBlur={formValidation.handleBlur}
        value={value}
        defaultChecked={defaultChecked}
      />
      <label className="form-check-label">{label}</label>
    </>
  );
}
