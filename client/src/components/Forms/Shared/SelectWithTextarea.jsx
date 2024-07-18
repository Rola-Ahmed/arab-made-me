import FormVlaidtionError from "./FormVlaidtionError";
import SelectOption from "./SelectOption";

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
      <SelectOption
        formValidation={formValidation}
        vlaidationName={vlaidationName}
        isRequired={isRequired}
        title={title}
        array={array}
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
