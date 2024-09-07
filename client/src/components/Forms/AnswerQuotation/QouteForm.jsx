import InputField from "components/Forms/Shared/InputField";
import SelectWithTextarea from "components/Forms/Shared/SelectWithTextarea";
import DateTimeInput from "components/Forms/Shared/DateTimeInput";
import SelectGroup from "components/Forms/Shared/SelectGroup";
import SelectOption from "components/Forms/Shared/SelectOption";
import TimeLine from "../Shared/TimeLine/TimeLine";
import { SupplyLocationArr } from "constants/SupplyLocationArr";
import { ShippingTypeSizeArr } from "constants/ShippingTypeSizeArr";
import { shippingConditionsArr } from "constants/shippingConditionsArr";
import { packingConditionsArr } from "constants/packingConditionsArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";
import { paymentTypeArr } from "constants/paymentTypeArr";
import CurrentAcccountInfo from "../Shared/CurrentAcccountInfo";
export default function QouteForm(props) {
  let { formValidation, errorMsg, isLoading } = props;
  return (
    <form onSubmit={formValidation.handleSubmit}>
      <section id="view" className="req-visit">
        <div className="container container-req ">
          <CurrentAcccountInfo />
        </div>
        

        {/* Grid  */}
        <div className="container container-req ">
          <div className="input-content ">
            {errorMsg?.response && (
              <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                {errorMsg?.response}
              </div>
            )}

            <div className="title-text w-100 ">
              <h5> Quotation Details</h5>
            </div>

            <div className="row row-container w-100 ">
              <div className="col-md-6 col-sm-12">
                <InputField
                  isRequired={true}
                  title={"Total Quantity"}
                  formValidation={formValidation}
                  vlaidationName={"minQuantity"}
                />
              </div>

              <div className="col-md-6 col-sm-12 d-none">
                <div className="form-group">
                  {/* <label className={"form-title"}> */}
                  <label>requested Quantity</label>
                  <input className="form-control " readonly />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <InputField
                  isRequired={true}
                  title={"Price"}
                  formValidation={formValidation}
                  vlaidationName={"price"}
                />
              </div>

              <div className="col-md-6 col-sm-12">
                <InputField
                  isRequired={false}
                  title={"Discounts"}
                  formValidation={formValidation}
                  vlaidationName={"discounts"}
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
                  vlaidationName={"paymentType"}
                  textAreaOther={"paymentTypeOther"}
                  isRequired={true}
                  title={"payment Term"}
                  array={paymentTypeArr}
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
                <SelectGroup
                  formValidation={formValidation}
                  vlaidationName="ShippingTypeSize"
                  textAreaOther={"ShippingTypeSizeOther"}
                  isRequired={true}
                  title={"Shipping Type and Size"}
                  array={ShippingTypeSizeArr}
                />
              </div>

              <div className="col-md-6 col-sm-12">
                <SelectOption
                  formValidation={formValidation}
                  vlaidationName={"SupplyLocation"}
                  isRequired={true}
                  title={"Supply Location"}
                  array={SupplyLocationArr}
                />
              </div>
              <TimeLine
                formValidation={formValidation}
                vlaidationName={"timeLine"}
              />

              <div className="col-12">
                <div className="form-group">
                  <label forhtml="notes">Other Information</label>
                  <textarea
                    type="email"
                    className="form-control"
                    id="notes"
                    name="notes"
                    placeholder="Conditions of delay"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.notes}
                  />
                  {formValidation.errors.notes &&
                  formValidation.touched.notes ? (
                    <small className="form-text text-danger">
                      {formValidation.errors.notes}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="col-12 action">
                {isLoading ? (
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

                        if (targetElement) {
                          targetElement.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }
                    }}
                  >
                    Send Quotation
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
}
