// import FormVlaidtionError from "./FormVlaidtionError";

export default function TimeLineList(props) {
  const { formValidation, vlaidationName, index } = props;

  function removenewSepcialChar() {
    let newArray = formValidation.values.timeLine;
    newArray.pop(); // Remove the last item

    formValidation.setFieldValue(vlaidationName, newArray);
  }
  return (
    <div className="timeline form-control checked d-flex justify-content-between align-content-center">
      <div className="row w-100  p-0 m-0">
        <div
          className={`form-group    ${
            formValidation.values[vlaidationName]?.length - 1 === index &&
            index !== 0
              ? "   col-lg-5 col-md-11 col-sm-12 "
              : "  col-lg-6 col-md-12"
          }`}
        >
          <label>Date* </label>
          <input
            type="datetime-local"
            className="form-control d-block"
            name={`${vlaidationName}.${index}.date`}
            value={formValidation.values[vlaidationName][index].date}
            onChange={formValidation.handleChange}
            onBlur={formValidation.handleBlur}
          />

          {formValidation.errors[vlaidationName]?.[index]?.date &&
            formValidation.touched[vlaidationName]?.[index]?.date && (
              <small className="form-text text-danger">
                {formValidation.errors[vlaidationName]?.[index]?.date}
              </small>
            )}
        </div>

        <div
          className={`form-group    ${
            formValidation.values[vlaidationName]?.length - 1 === index &&
            index !== 0
              ? "   col-lg-5 col-md-11 col-sm-12 "
              : "  col-lg-6 col-md-12"
          }`}
        >
          <label>Quantity* </label>
          <input
            type="text"
            className="form-control"
            id={`timeLine[${index}].quantity`}
            name={`timeLine.${index}.quantity`}
            value={formValidation.values[vlaidationName]?.[index].quantity}
            onChange={formValidation.handleChange}
            onBlur={formValidation.handleBlur}
          />

          {formValidation.errors[vlaidationName]?.[index]?.quantity &&
            formValidation.touched[vlaidationName]?.[index]?.quantity && (
              <small className="form-text text-danger">
                {formValidation.errors[vlaidationName]?.[index]?.quantity}
              </small>
            )}
        </div>

        {formValidation.values[vlaidationName]?.length - 1 == index &&
        index !== 0 ? (
          <div className="col-md-1 col-sm-12">
            <div className="w-100 h-100 justify-content-center align-items-center d-flex pt-mt ">
              <i
                class=" w-25 cursor fa-solid fa-minus text-white px-3 py-2"
                onClick={() => removenewSepcialChar()}
              ></i>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
