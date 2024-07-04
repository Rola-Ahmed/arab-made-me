import FormVlaidtionError from "./FormVlaidtionError";

export default function SelectWithTextarea(props) {
  let {
    formValidation,
    vlaidationName,
    textAreaOther,
    isRequired,
    title,
    array,
  } = props;
  return (
    <div className="form-group">
      <label>
        {title} {isRequired && "*"}
      </label>

      <select
        className="form-select form-control"
        id={vlaidationName}
        name={vlaidationName}
        onChange={formValidation.handleChange}
        onBlur={formValidation.handleBlur}
        value={formValidation.values[vlaidationName]}
      >
        {array?.map((item) => (
          <option value={item?.value}>{item?.name}</option>
        ))}
      </select>
      <FormVlaidtionError
        formValidation={formValidation}
        vlaidationName={vlaidationName}
      />
      {formValidation.values[vlaidationName] == "other" && (
        <textarea
          className="form-control w-100 "
          onChange={formValidation.handleChange}
          onBlur={formValidation.handleBlur}
          value={formValidation.values[textAreaOther]}
          id={textAreaOther}
          name={textAreaOther}
          rows="3"
          placeholder="enter more details"
        ></textarea>
      )}

      <FormVlaidtionError
        formValidation={formValidation}
        vlaidationName={textAreaOther}
      />
    </div>
  );
}
