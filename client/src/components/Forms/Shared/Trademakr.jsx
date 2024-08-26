import UploadDocument from "./UploadDocument";

export default function Trademakr(props) {
  let {
    formValidation,
    errorMsg,
    selectedDocs,
    setErrorMsg,
    setSelectedDocs,
    title,
    MediaName,
  } = props;
  return (
    <>
      <div className="col-12">
        <div className="form-check w-100 d-blcok ">
          <input
            className="form-check-input"
            type="checkbox"
            id="trademarkCheckBox"
            onChange={formValidation.handleChange}
            onBlur={formValidation.handleBlur}
            value={formValidation.values.trademarkCheckBox}
          />
          <label className="form-check-label">Do you have a trademark?</label>
        </div>
      </div>

      {formValidation.values.trademarkCheckBox && (
        <UploadDocument
          selectedDocs={selectedDocs}
          errorMsg={errorMsg}
          setSelectedDocs={setSelectedDocs}
          MediaName={MediaName}
          mediaMaxLen="3"
          meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg"]}
          setErrorMsg={setErrorMsg}
          title={title}
        />
      )}
    </>
  );
}
