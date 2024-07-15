import { useState } from "react";

import TextareaInput from "../Shared/TextareaInput";
import EtcProductPopUp from "../Shared/EtcProductPopUp";
import UploadDocument from "../Shared/UploadDocument";

import SelectWithTextarea from "../Shared/SelectWithTextarea";
import FormVlaidtionError from "../Shared/FormVlaidtionError";

import { shippingConditionsArr } from "constants/shippingConditionsArr";
import { packingConditionsArr } from "constants/packingConditionsArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";

import { SupplyLocationArr } from "constants/SupplyLocationArr";
import { ShippingTypeSizeArr } from "constants/ShippingTypeSizeArr";
import TimeLine from "../Shared/TimeLine/TimeLine";
import InputField from "../Shared/InputField";
import ProductMultiSelector from "../Shared/ProductMultiSelector";

export default function WhiteLabelForm(props) {
  let {
    allProductsArr,
    productIsSelected,
    isLoading,
    formValidation,
    errorMsg,
    setSelectedDocs,
    setErrorMsg,
    selectedDocs,
  } = props;
  // State variables

  const [selectedItem, setSelectedItem] = useState(null);

  const handleCheckboxProductNameChange = (item, isChecked) => {
    let productNameArr = formValidation.values.productName;

    // let updatedProductNames;
    if (isChecked) {
      productNameArr.push(item);
    } else {
      productNameArr = productNameArr.filter((name) => name != item);
    }
    formValidation.setFieldValue("productName", productNameArr);
  };

  return (
    <>
      <form
        id="view"
        className="container container-req "
        onSubmit={formValidation.handleSubmit}
      >
        <div className="input-content ">
          {errorMsg?.response ? (
            <div className="alert mt-3 p-2 alert-danger form-control text-dark">
              {errorMsg?.response}
            </div>
          ) : (
            ""
          )}

          {/* form description */}

          <div className="container container-po ">
            <div className="input-content ">
              <div className="row row-container w-100  align-content-center">
                <div className="title-text w-100 ">
                  <h5>White Label Details</h5>
                </div>
                {!productIsSelected && (
                  <div className="col-12">
                    <ProductMultiSelector
                      productDetails={allProductsArr}
                      formValidation={formValidation}
                      setSelectedItem={setSelectedItem}
                      vlaidationNameOnId="productId"
                      vliadationNameOnName="productName"
                      title={"selected product"}
                    />
                  </div>
                )}
                <div className="col-md-6 col-sm-12">
                  <InputField
                    isRequired={true}
                    formValidation={formValidation}
                    vlaidationName={"quantity"}
                    title="Quantity"
                  />
                </div>

                <TimeLine
                  formValidation={formValidation}
                  vlaidationName={"timeLine"}
                />

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

                <TextareaInput
                  vlaidationName="otherConditions"
                  formValidation={formValidation}
                  isRequired={false}
                  title="Other Conditions"
                />

                <TextareaInput
                  vlaidationName="moreDetails"
                  formValidation={formValidation}
                  isRequired={false}
                  title="More Details"
                />

                <UploadDocument
                  selectedDocs={selectedDocs}
                  errorMsg={errorMsg}
                  setSelectedDocs={setSelectedDocs}
                  MediaName="docs"
                  mediaMaxLen="3"
                  meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg", "csv"]}
                  setErrorMsg={setErrorMsg}
                  title="Upload Documents"
                />
              </div>
            </div>

            <div className="action">
              <div className="col-12">
                {isLoading?.submitLoading ? (
                  <button type="button" className="action-btn btn-1 w-100 ">
                    <i className="fas fa-spinner fa-spin"></i>
                  </button>
                ) : (
                  <button
                    className="action-btn btn-1 w-100"
                    type="submit"
                    onClick={() => {
                      if (formValidation.isValid == false) {
                        const targetElement = document.getElementById(
                          Object.keys(formValidation.errors)?.[0]
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
                )}
              </div>
            </div>
          </div>
          {/*  */}
        </div>
      </form>

      <EtcProductPopUp
        show={selectedItem != null}
        // show={true}
        onHide={() => {
          setSelectedItem(null);
        }}
        selectedItemId={selectedItem}
      />
    </>
  );
}
