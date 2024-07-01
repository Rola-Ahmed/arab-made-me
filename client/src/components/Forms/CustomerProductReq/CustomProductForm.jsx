import Trademakr from "../Shared/Trademakr";
import UploadDocument from "../Shared/UploadDocument";
import TextareaInput from "../Shared/TextareaInput";
import FormVlaidtionError from "../Shared/FormVlaidtionError";
import InputField from "../Shared/InputField";
import TimeLine from "../Shared/TimeLine/TimeLine";
import SelectOption from "../Shared/SelectOption";
import { packingConditionsArr } from "constants/packingConditionsArr";
import { SupplyLocationArr } from "constants/SupplyLocationArr";
import { shippingConditionsArr } from "constants/shippingConditionsArr";
import { ShippingTypeSizeArr } from "constants/ShippingTypeSizeArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";

function CustomProductForm(props) {
  let {
    isLoading,
    formValidation,
    selectedDocs,
    setSelectedDocs,
    specialCharacteristicsArr,
    SetSpecialCharacteristicsArr,
    errorMsg,
    setErrorMsg,
  } = props;

  function addnewSepcialChar() {
    SetSpecialCharacteristicsArr((prevSections) => [
      ...prevSections,
      specialCharacteristicsArr?.length,
    ]);
  }

  function removenewSepcialChar() {
    SetSpecialCharacteristicsArr((prev) => prev.slice(0, -1));
  }

  return (
    <form
      onSubmit={formValidation.handleSubmit}
      className="container container-req "
    >
      <div className="input-content ">
        {errorMsg?.response ? (
          <div className="alert mt-3 p-2 alert-danger form-control text-dark w-100">
            {errorMsg?.response}
          </div>
        ) : (
          ""
        )}

        <div className="title-text w-100 ">
          <h5> product Details</h5>
        </div>

        <div className="row row-container-sepcialChar w-100 ">
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="productName">Product Name *</label>
              <input
                type="text"
                className="form-control"
                id="productName"
                name="productName"
                onChange={formValidation.handleChange}
                onBlur={formValidation.handleBlur}
                value={formValidation.values.productName}
              />

              <FormVlaidtionError
                formValidation={formValidation}
                vlaidationName="productName"
              />
            </div>
          </div>
          {/* new  */}

          {/* end new */}
          <div className="col-12 ms-3">
            <div className="border-row row">
              <div>
                <label className="pb-2">Product Characteristics</label>
                <div className="d-flex justify-content-between align-items-center">
                  <div class="form-check w-100 d-blcok ">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="productType"
                      name="productType"
                      value="text"
                      defaultChecked
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                    />
                    <label class="form-check-label">Text</label>
                  </div>
                  <div class="form-check w-100 d-blcok ">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="productType"
                      name="productType"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value="docs"
                    />
                    <label class="form-check-label">Upload Documents</label>
                  </div>
                </div>
              </div>

              {formValidation.values.productType == "text" && (
                <>
                  <div className="col-12 ms-3">
                    <div className="border-row row">
                      <div className="col-xxl-6 col-xl-6   col-lg-6 col-md-12 col-sm-12">
                        <div className="form-group">
                          <label>keyword </label>

                          <input
                            type="text"
                            id="specialCharKeyWord"
                            name="specialCharKeyWord"
                            className="form-control"
                            placeholder="Color"
                            onChange={formValidation.handleChange}
                            onBlur={formValidation.handleBlur}
                            value={formValidation.values.specialCharKeyWord}
                          />

                          <FormVlaidtionError
                            formValidation={formValidation}
                            vlaidationName="specialCharKeyWord"
                          />
                        </div>
                      </div>
                      <div className="col-xxl-6 col-xl-6   col-lg-6 col-md-12 col-sm-12">
                        <div className="form-group">
                          <label>description </label>

                          <input
                            type="text"
                            id="specialCharDesc"
                            name="specialCharDesc"
                            className="form-control"
                            placeholder="Color"
                            onChange={formValidation.handleChange}
                            onBlur={formValidation.handleBlur}
                            value={formValidation.values.specialCharDesc}
                          />

                          <FormVlaidtionError
                            formValidation={formValidation}
                            vlaidationName="specialCharDesc"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {specialCharacteristicsArr?.map((dateSection, index) => (
                    // <>{dateSection}</>

                    <div className="col-12 ms-3">
                      <div className="border-row row">
                        <div
                          className={`  col-xxl-6 col-xl-6   col-lg-6 col-md-12 col-sm-12`}
                        >
                          <div className="form-group">
                            <label>keyword {index + 2}* </label>

                            <input
                              type="text"
                              id={`specialCharKeyWord${index}`}
                              name={`specialCharKeyWord${index}`}
                              className="form-control"
                              onChange={formValidation.handleChange}
                              onBlur={formValidation.handleBlur}
                              placeholder="Color"
                              value={
                                formValidation.values[
                                  `specialCharKeyWord${index}`
                                ]
                              }
                            />

                            <FormVlaidtionError
                              formValidation={formValidation}
                              vlaidationName={`specialCharKeyWord${index}`}
                            />
                          </div>
                        </div>

                        <div
                          className={` ${
                            specialCharacteristicsArr.length - 1 == index
                              ? " col-xxl-5 col-xl-5   col-lg-5 col-md-11 col-sm-12 col-12"
                              : "col-xxl-6 col-xl-6   col-lg-6 col-md-12 col-sm-12"
                          }`}
                        >
                          <div className="form-group">
                            <label>description {index + 2}* </label>

                            <input
                              type="text"
                              id={`specialCharDesc${index}`}
                              name={`specialCharDesc${index}`}
                              className="form-control"
                              onChange={formValidation.handleChange}
                              onBlur={formValidation.handleBlur}
                              placeholder="Color"
                              value={
                                formValidation.values[`specialCharDesc${index}`]
                              }
                            />

                            <FormVlaidtionError
                              formValidation={formValidation}
                              vlaidationName={`specialCharDesc${index}`}
                            />
                          </div>
                        </div>
                        {specialCharacteristicsArr?.length - 1 === index ? (
                          <div className="col-md-1 col-sm-12   ">
                            <div className="h-100 w-100 justify-content-center align-items-center d-flex pt-mt ">
                              <i
                                class=" cursor fa-solid fa-minus text-white px-3 py-2 w-25"
                                onClick={() => removenewSepcialChar()}
                              ></i>
                            </div>
                            {/* {dateSection} */}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="col-12">
                    {specialCharacteristicsArr.length < 4 ? (
                      <div className="action  ">
                        <div
                          className="cursor "
                          onClick={() => addnewSepcialChar()}
                        >
                          <button className="action-btn btn-1" type="button">
                            add
                          </button>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              )}

              {formValidation.values.productType == "docs" && (
                <>
                  <UploadDocument
                    selectedDocs={selectedDocs}
                    errorMsg={errorMsg}
                    setSelectedDocs={setSelectedDocs}
                    MediaName="productDocs"
                    mediaMaxLen="3"
                    meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg"]}
                    setErrorMsg={setErrorMsg}
                    title="Upload Documents"
                  />
                </>
              )}
            </div>
          </div>

          {/* newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww */}

          <div className="col-md-6 col-sm-12">
            <InputField
              isRequired={true}
              formValidation={formValidation}
              vlaidationName={"quantity"}
              title="Quantity"
            />
          </div>

          <div className="col-md-6 col-sm-12">
            <SelectOption
              formValidation={formValidation}
              vlaidationName={"shippingConditions"}
              textAreaOther={"shippingConditionsOther"}
              isRequired={true}
              title={"shipping conditions"}
              array={shippingConditionsArr}
            />
          </div>

          <div className="col-md-6 col-sm-12">
            <SelectOption
              formValidation={formValidation}
              vlaidationName={"packingConditions"}
              textAreaOther={"packingConditionsOther"}
              isRequired={true}
              title={"Packing condition"}
              array={packingConditionsArr}
            />
          </div>

          <div className="col-md-6 col-sm-12">
            <SelectOption
              formValidation={formValidation}
              vlaidationName={"ShippingTypeSize"}
              textAreaOther={"ShippingTypeSizeOther"}
              isRequired={true}
              title={"Shipping Type and Size"}
              array={ShippingTypeSizeArr}
            />
          </div>

          <div className="col-md-6 col-sm-12">
            <SelectOption
              formValidation={formValidation}
              vlaidationName={"qualityConditions"}
              textAreaOther={"qualityConditionsOther"}
              isRequired={true}
              title={"Quality Conditions"}
              array={qualityConditionsArr}
            />
          </div>

          <div className="col-md-6 col-sm-12">
            <div className="form-group">
              <label>Supply Location *</label>
              <select
                id="SupplyLocation"
                className="form-select form-control"
                onChange={formValidation.handleChange}
                onBlur={formValidation.handleBlur}
                value={formValidation.values.SupplyLocation}
              >
                {SupplyLocationArr.map((item) => (
                  <option value={item?.value}>{item?.name}</option>
                ))}
              </select>

              <FormVlaidtionError
                formValidation={formValidation}
                vlaidationName="SupplyLocation"
              />
            </div>
          </div>
          <TimeLine
            formValidation={formValidation}
            vlaidationName={"timeLine"}
          />

          <TextareaInput
            vlaidationName="otherConditions"
            formValidation={formValidation}
            isRequired={false}
            title="Other Conditions"
          />

          <Trademakr
            formValidation={formValidation}
            errorMsg={errorMsg}
            selectedDocs={selectedDocs}
            // sub section

            setSelectedDocs={setSelectedDocs}
            MediaName="TrademakrDocs"
            mediaMaxLen="3"
            meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg"]}
            setErrorMsg={setErrorMsg}
          />

          {/* end new */}
          <TextareaInput
            vlaidationName="inqueries"
            formValidation={formValidation}
            isRequired={true}
            title="inqueries"
          />

          <TextareaInput
            vlaidationName="technicalSpecifications"
            formValidation={formValidation}
            isRequired={true}
            title="Technical Specifications"
          />

          <UploadDocument
            selectedDocs={selectedDocs}
            errorMsg={errorMsg}
            setSelectedDocs={setSelectedDocs}
            MediaName="docs"
            mediaMaxLen="3"
            meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg"]}
            setErrorMsg={setErrorMsg}
            title="Upload Documents"
          />

          {isLoading?.submitLoading ? (
            <div className="col-12 action">
              <button type="button" className="action-btn btn-1 w-100 ">
                <i className="fas fa-spinner fa-spin text-white"></i>
              </button>
            </div>
          ) : (
            <div className="col-12 action">
              <button
                className="action-btn btn-1 w-100"
                type="submit"
                onClick={() => {
                  if (formValidation.isValid == false) {
                    const targetElement = document.getElementById(
                      Object.keys(formValidation?.errors)?.[0]
                    );

                    // Scroll to the target element
                    if (targetElement) {
                      targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }
                }}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

export default CustomProductForm;
