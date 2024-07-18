import FormVlaidtionError from "./FormVlaidtionError";

export default function SelectGroup(props) {
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
        onChange={formValidation.handleChange}
        onBlur={formValidation.handleBlur}
        value={formValidation.values[vlaidationName]}
      >
        <option value="">Select</option>
        {array?.map((item) => (
          <optgroup key={item?.value} label={item?.value}>
            <>
              {item?.subValues?.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </>
          </optgroup>
        ))}
      </select>
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
        vlaidationName={vlaidationName}
      />
    </div>
  );
}
