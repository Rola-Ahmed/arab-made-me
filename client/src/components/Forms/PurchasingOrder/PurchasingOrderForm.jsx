import TextareaInput from "../Shared/TextareaInput";

import { paymentTypeArr } from "constants/paymentTypeArr";

import UploadDocument from "../Shared/UploadDocument";

import { shippingConditionsArr } from "constants/shippingConditionsArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";
import { SupplyLocationArr } from "constants/SupplyLocationArr";
import { ShippingTypeSizeArr } from "constants/ShippingTypeSizeArr";
import { packingConditionsArr } from "constants/packingConditionsArr";

import TimeLine from "../Shared/TimeLine/TimeLine";
import FormVlaidtionError from "../Shared/FormVlaidtionError";
import SelectWithTextarea from "../Shared/SelectWithTextarea";
import InputField from "../Shared/InputField";
import SelectOption from "../Shared/SelectOption";
import DateTimeInput from "../Shared/DateTimeInput";

function PurchasingOrderForm(props) {
  let {
    productDetails,
    isLoading,
    productIsSelected,
    setSelectedDocs,
    selectedDocs,
    formValidation,
    errorMsg,
    setErrorMsg,
    SourcingIsSelected,
  } = props;

  // console.log("formvalitaion", formValidation);

  return (
    <form
      id="view"
      className="container container-po "
      onSubmit={formValidation.handleSubmit}
    >
      <div className="input-content ">
        {errorMsg?.response && (
          <div className="alert mt-3 p-2 alert-danger form-control text-dark">
            {errorMsg?.response}
          </div>
        )}

        <div className="title-text w-100 ">
          <h5>PO Details</h5>
        </div>

        <div className="row row-container w-100 ">
          {!productIsSelected && !SourcingIsSelected && (
            <div className="col-md-6 col-sm-12">
              <div className="form-group">
                <label>selected product</label>
                <select
                  id="productId"
                  className="form-select form-control"
                  onChange={formValidation.handleChange}
                  onBlur={formValidation.handleBlur}
                  value={formValidation?.values?.productId}
                  onClick={(e) => {
                    let selectedProductName = "";
                    productDetails?.find(
                      (item) =>
                        item.id == e.target.value
                          ? (selectedProductName = item.name)
                          : ""
                      // )
                    );

                    formValidation.setFieldValue(
                      "productName",
                      selectedProductName
                    );
                  }}
                >
                  <option value="">Select </option>
                  {productDetails?.map((item) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>

                <FormVlaidtionError
                  formValidation={formValidation}
                  vlaidationName="productId"
                />
              </div>
            </div>
          )}

          <div className="col-md-6 col-sm-12">
            <InputField
              isRequired={true}
              formValidation={formValidation}
              vlaidationName={"quantity"}
              title="Total Quantity"
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <DateTimeInput
              isRequired={true}
              title={"Form Deadline"}
              formValidation={formValidation}
              vlaidationName={"deadline"}
            />
          </div>

          {/* newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww */}

          <div className="col-md-6 col-sm-12">
            <SelectOption
              formValidation={formValidation}
              vlaidationName={"SupplyLocation"}
              isRequired={true}
              title={"Supply Location"}
              array={SupplyLocationArr}
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <SelectWithTextarea
              formValidation={formValidation}
              vlaidationName={"shippingConditions"}
              textAreaOther={"shippingConditionsOther"}
              isRequired={true}
              title={"shipping conditions"}
              array={shippingConditionsArr}
            />
          </div>

          <div className="col-md-6 col-sm-12">
            <SelectWithTextarea
              formValidation={formValidation}
              vlaidationName={"ShippingTypeSize"}
              textAreaOther={"ShippingTypeSizeOther"}
              isRequired={true}
              title={"Shipping Type and Size"}
              array={ShippingTypeSizeArr}
            />
          </div>

          <div className="col-md-6 col-sm-12">
            <SelectWithTextarea
              formValidation={formValidation}
              vlaidationName={"qualityConditions"}
              textAreaOther={"qualityConditionsOther"}
              isRequired={true}
              title={"Quality Condition"}
              array={qualityConditionsArr}
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <SelectWithTextarea
              formValidation={formValidation}
              vlaidationName={"packingConditions"}
              textAreaOther={"packingConditionsOther"}
              isRequired={true}
              title={"Packing condition"}
              array={packingConditionsArr}
            />
          </div>

          <div className="col-md-6 col-sm-12">
            <SelectWithTextarea
              formValidation={formValidation}
              vlaidationName={"paymentType"}
              textAreaOther={"paymentTypeOther"}
              isRequired={true}
              title={"payment Term"}
              array={paymentTypeArr}
            />
          </div>

          <div className="col-12">
            <div class="form-check w-100 d-blcok ">
              <input
                class="form-check-input"
                type="checkbox"
                id="allowDelay"
                onChange={formValidation.handleChange}
                onBlur={formValidation.handleBlur}
                value={formValidation.values.allowDelay}
              />
              <label class="form-check-label">Allow Delay</label>
            </div>
          </div>
          {formValidation?.values?.allowDelay && (
            <div className="col-md-6 col-sm-12">
              <div className="form-group">
                <label forhtml="timeManufacturingDelay">
                  time of Manufacturing Delay *
                </label>

                <div className="input-group  h-100">
                  <div className="input-group-prepend">
                    <select
                      className="input-group-text h-100 p-2 m-0"
                      id="timeManufacturingDelayDuration"
                      onChange={formValidation.handleChange}
                      onBlur={formValidation.handleBlur}
                      value={
                        formValidation.values.timeManufacturingDelayDuration
                      }
                    >
                      <option value="day">day</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                    </select>
                  </div>

                  <input
                    className="form-control"
                    id="timeManufacturingDelay"
                    placeholder="1 week"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.timeManufacturingDelay}
                  />
                </div>
                <FormVlaidtionError
                  formValidation={formValidation}
                  vlaidationName="timeManufacturingDelay"
                />
              </div>
            </div>
          )}
          <div className="col-12 ">
            <TimeLine
              formValidation={formValidation}
              vlaidationName={"timeLine"}
            />
          </div>

          <div className="col-12">
            <TextareaInput
              vlaidationName="conditionsOfDelays"
              formValidation={formValidation}
              isRequired={false}
              title="Conditions of delay"
            />
          </div>

          <div className="col-12">
            <TextareaInput
              vlaidationName="instructions"
              formValidation={formValidation}
              isRequired={false}
              title="instructions"
            />
          </div>

          <UploadDocument
            selectedDocs={selectedDocs}
            errorMsg={errorMsg}
            setSelectedDocs={setSelectedDocs}
            MediaName="legalStamp"
            mediaMaxLen="1"
            meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg"]}
            setErrorMsg={setErrorMsg}
            title="legal Stamp"
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

          <div className=" action col-12">
            {isLoading?.submitLoading ? (
              <button type="button" className="action-btn btn-1 w-100 ">
                <i className="fas fa-spinner fa-spin"></i>
              </button>
            ) : (
              <button
                type="submit"
                className="action-btn btn-1 w-100 submitButton"
                onClick={() => {
                  if (formValidation.isValid == false) {
                    const targetElement = document.getElementById(
                      Object.keys(formValidation.errors)?.[0]
                    );

                    Object.keys(formValidation.values).forEach((field) => {
                      formValidation.setFieldTouched(field, true);
                    });

                    if (targetElement) {
                      targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    } else {
                      const targetElement = document.getElementById("view");
                      if (targetElement) {
                        targetElement?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }
                    }
                  }
                }}
              >
                Send PO
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

export default PurchasingOrderForm;
