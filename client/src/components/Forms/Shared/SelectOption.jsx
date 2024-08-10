import FormVlaidtionError from "./FormVlaidtionError";

export default function SelectOption(props) {
  let { formValidation, vlaidationName, isRequired, title, array } = props;
  return (
    <div className="form-group">
      <label className="lh-normal">
        {title} {isRequired && "*"}
      </label>

      <select
        className="form-select form-control"
        id={vlaidationName}
        // name={vlaidationName}
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
    </div>
  );
}
