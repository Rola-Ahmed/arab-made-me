import FormVlaidtionError from "./FormVlaidtionError";

export default function TextareaInput(props) {
  let { formValidation, vlaidationName, isRequired, title } = props;
  return (
    <>
      <div className="col-12">
        <div className="form-group">
          <label>
            {title} {isRequired && "*"}
          </label>
          <textarea
            className="form-control w-100 "
            onChange={formValidation.handleChange}
            onBlur={formValidation.handleBlur}
            value={formValidation.values[vlaidationName]}
            id={vlaidationName}
            name={vlaidationName}
            rows="3"
            placeholder="enter more details"
          ></textarea>
        </div>
      </div>

      <FormVlaidtionError
        formValidation={formValidation}
        vlaidationName={vlaidationName}
      />
    </>
  );
}
