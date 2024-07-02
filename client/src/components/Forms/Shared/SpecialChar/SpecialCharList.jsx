import { removefromArray } from "utils/removeFromArray";

export default function SpecialCharList(props) {
  let { formValidation, index } = props;

  function removenewSepcialChar(index) {
    let oldArr = formValidation.values.productCharacteristic;
    let newArray = removefromArray(index, oldArr);

    formValidation.setFieldValue("productCharacteristic", newArray);
  }

  return (
    <div
      className="col-12 ms-3"
      id={formValidation.values["productCharacteristic"]}
      key={index}
    >
      <div className="border-row row">
        <div
          className={`form-group   col-lg-6 col-md-12"
                            `}
        >
          <label>keyword {index + 1}* </label>

          <input
            className="form-control"
            onChange={formValidation.handleChange}
            onBlur={formValidation.handleBlur}
            placeholder="Color"
            id={`productCharacteristic.${index}.keyword`}
            value={formValidation.values.productCharacteristic[index].keyword}
          />
          {formValidation.errors.productCharacteristic?.[index]?.keyword &&
            formValidation.touched.productCharacteristic?.[index]?.keyword && (
              <small className="form-text text-danger">
                {
                  formValidation.errors["productCharacteristic"]?.[index]
                    ?.keyword
                }
              </small>
            )}
        </div>

        <div
          className={`form-group    ${
            formValidation.values["productCharacteristic"]?.length - 1 ===
              index && index !== 0
              ? "   col-lg-5 col-md-11 col-sm-12 "
              : "  col-lg-6 col-md-12"
          }`}
        >
          <label>description {index + 1}* </label>

          <input
            type="text"
            id={`productCharacteristic.${index}.value`}
            className="form-control"
            onChange={formValidation.handleChange}
            onBlur={formValidation.handleBlur}
            placeholder="Color"
            value={formValidation.values.productCharacteristic[index].value}
          />

          {formValidation.errors["productCharacteristic"]?.[index]?.value &&
            formValidation.touched["productCharacteristic"]?.[index]?.value && (
              <small className="form-text text-danger">
                {formValidation.errors["productCharacteristic"]?.[index]?.value}
              </small>
            )}
        </div>
        {formValidation.values["productCharacteristic"]?.length - 1 == index &&
          index !== 0 && (
            <div className="col-md-1 col-sm-12  justify-content-center align-items-center d-flex pt-mt ">
              <i
                class=" cursor fa-solid fa-minus text-white px-3 py-2 w-25"
                onClick={() => removenewSepcialChar(index)}
              ></i>
            </div>
          )}
      </div>
    </div>
  );
}
