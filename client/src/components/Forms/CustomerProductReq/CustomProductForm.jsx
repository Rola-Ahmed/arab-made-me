import Trademakr from "../Shared/Trademakr";
import UploadDocument from "../Shared/UploadDocument";
import TextareaInput from "../Shared/TextareaInput";
import FormVlaidtionError from "../Shared/FormVlaidtionError";
import InputField from "../Shared/InputField";
import TimeLine from "../Shared/TimeLine/TimeLine";
import SelectWithTextarea from "../Shared/SelectWithTextarea";
import { packingConditionsArr } from "constants/packingConditionsArr";
import { SupplyLocationArr } from "constants/SupplyLocationArr";
import { shippingConditionsArr } from "constants/shippingConditionsArr";
import { ShippingTypeSizeArr } from "constants/ShippingTypeSizeArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";
import SpecialChar from "../Shared/SpecialChar/SpecialChar";
// import RadioInput from "../Shared/RadioInput";
import DateTimeInput from "../Shared/DateTimeInput";
function CustomProductForm(props) {
  let {
    isLoading,
    formValidation,
    selectedDocs,
    setSelectedDocs,
    errorMsg,
    setErrorMsg,
  } = props;


  return (
    <form
      onSubmit={formValidation.handleSubmit}
      className="container container-req "
    >
      <div className="input-content ">
        {errorMsg?.response && (
          <div className="alert mt-3 p-2 alert-danger form-control text-dark w-100">
            {errorMsg?.response}
          </div>
        )}

        <div className="title-text w-100 ">
          <h5> product Details</h5>
        </div>

        <div className="row row-gap-24 w-100 ">
          <div className="col-12">
            <InputField
              isRequired={true}
              title={"Product Name"}
              formValidation={formValidation}
              vlaidationName={"productName"}
            />
          </div>

          {/* end new */}
          <div className="col-12 ms-3 ">
            <div className="border-row row">
              <div>
                <label className="pb-2">Product Characteristics</label>
              </div>

              <SpecialChar formValidation={formValidation} productCharacteristic='productCharacteristic'/>
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
            <DateTimeInput
              isRequired={true}
              title={"Form Deadline"}
              formValidation={formValidation}
              vlaidationName={"deadline"}
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

          <Trademakr
            formValidation={formValidation}
            errorMsg={errorMsg}
            selectedDocs={selectedDocs}
            // sub section
            setSelectedDocs={setSelectedDocs}
            MediaName="tradeMark"
            mediaMaxLen="3"
            meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg"]}
            setErrorMsg={setErrorMsg}
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
