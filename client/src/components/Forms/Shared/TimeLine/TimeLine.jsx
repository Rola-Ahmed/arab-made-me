// import FormVlaidtionError from "./FormVlaidtionError";

import TimeLineList from "./TimeLineList";

export default function TimeLine(props) {
  const { formValidation, vlaidationName } = props;

  function addnewSepcialChar() {
    let newArray = formValidation.initialValues[vlaidationName]?.[0];
    let existingArray = formValidation.values[vlaidationName];

    // Merge the existing files with the new files
    const combinedArray = existingArray.concat(newArray);

    // Update the form state with the combined files
    formValidation.setFieldValue(vlaidationName, combinedArray);
  }

  function oneBatch() {
    let newArray = formValidation.values[vlaidationName]?.slice(0, 1);

    // Merge the existing files with the new files
    const combinedArray = newArray;

    // Update the form state with the combined files
    formValidation.setFieldValue(vlaidationName, combinedArray);
  }

  return (
    // <div className="col-12" id={formValidation.values[vlaidationName]}>
    <div className="col-12" id={vlaidationName}>
      <div className="form-group form-control">
        <div className="form-group timeline-container">
          <label> Timeline</label>
          <div className="d-flex justify-content-between align-items-center w-100 ">
            <div className="form-check w-100 d-blcok ">
              <input
                className="form-check-input p-0"
                type="radio"
                id="recurrence"
                name="recurrence"
                onChange={formValidation.handleChange}
                onBlur={formValidation.handleBlur}
                value={"oneBatch"}
                onClick={() => {
                  oneBatch();
                }}
              />
              <label className="form-check-label">1 Batch</label>
            </div>

            <div className="form-check w-100 d-blcok ">
              <input
                className="form-check-input p-0"
                type="radio"
                id="recurrence"
                name="recurrence"
                onChange={formValidation.handleChange}
                onBlur={formValidation.handleBlur}
                value={"repeat"}
              />
              <label className="form-check-label">Repeat</label>
            </div>
          </div>
          {/* <div className="timeline form-control checked d-flex justify-content-between align-content-center"> */}
          {formValidation.values[vlaidationName]?.length > 0 &&
            formValidation.values[vlaidationName]?.map((friend, index) => (
              <TimeLineList
                formValidation={formValidation}
                vlaidationName={vlaidationName}
                index={index}
              />
            ))}
          {formValidation.values.recurrence == "repeat" ? (
            <div className="action ">
              <div className="cursor" onClick={() => addnewSepcialChar()}>
                <button className="action-btn btn-1 " type="button">
                  add
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
