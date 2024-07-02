import FormVlaidtionError from "./FormVlaidtionError";

export default function InputField({
  formValidation,
  vlaidationName,
  isRequired,
  title,
}) {
  return (
    <>
      <div className="form-group">
        <label>
          {title} {isRequired && "*"}
        </label>
        <input
          className="form-control"
          id={vlaidationName}
          onChange={formValidation.handleChange}
          onBlur={formValidation.handleBlur}
          value={formValidation.values[vlaidationName]}
        />
        <FormVlaidtionError
          formValidation={formValidation}
          vlaidationName={vlaidationName}
        />
      </div>
    </>
  );
}
