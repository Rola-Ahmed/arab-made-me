import SpecialCharList from "./SpecialCharList";

export default function SpecialChar(props) {
  let { formValidation } = props;

  function addnewSepcialChar() {
    let newArray = formValidation.initialValues["productCharacteristic"]?.[0];
    let existingArray = formValidation.values["productCharacteristic"];
    // Merge the existing files with the new files
    const combinedArray = existingArray.concat(newArray);
    // Update the form state with the combined files
    formValidation.setFieldValue("productCharacteristic", combinedArray);
  }
  return (
    <>
      {formValidation.values.productCharacteristic?.map(
        (dateSection, index) => (
          <SpecialCharList index={index} formValidation={formValidation} />
        )
      )}
      {formValidation.values["productCharacteristic"]?.length > 0 && (
        <div className="action ">
          <div className="cursor" onClick={() => addnewSepcialChar()}>
            <button className="action-btn btn-1 " type="button">
              {" "}
              add
            </button>
          </div>
        </div>
      )}
    </>
  );
}
