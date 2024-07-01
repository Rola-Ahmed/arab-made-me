import React from "react";
import UploadDocument from "./UploadDocument";

export default function Trademakr(props) {
  let { formValidation, errorMsg, selectedDocs, setErrorMsg, setSelectedDocs,title } =
    props;
  return (
    <>
      <div className="col-12">
        <div class="form-check w-100 d-blcok ">
          <input
            class="form-check-input"
            type="checkbox"
            id="trademarkCheckBox"
            onChange={formValidation.handleChange}
            onBlur={formValidation.handleBlur}
            value={formValidation.values.trademarkCheckBox}
          />
          <label class="form-check-label">Do you have a trademark?</label>
        </div>
      </div>

      {formValidation.values.trademarkCheckBox && (
        <UploadDocument
          selectedDocs={selectedDocs}
          errorMsg={errorMsg}
          setSelectedDocs={setSelectedDocs}
          MediaName="productDocs"
          mediaMaxLen="3"
          meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg"]}
          setErrorMsg={setErrorMsg}
          title={title}
        />
      )}
    </>
  );
}
