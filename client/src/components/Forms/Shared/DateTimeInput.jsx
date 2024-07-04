import FormVlaidtionError from "./FormVlaidtionError";

export default function DateTimeInput({
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
          type="datetime-local"
          className="form-control d-block"
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
