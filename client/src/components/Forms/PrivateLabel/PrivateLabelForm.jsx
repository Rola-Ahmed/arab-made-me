import { useState } from "react";

import TextareaInput from "../Shared/TextareaInput";
import EtcProductPopUp from "../Shared/EtcProductPopUp";
import UploadDocument from "../Shared/UploadDocument";
import Trademakr from "../Shared/Trademakr";
import ProductMultiSelector from "../Shared/ProductMultiSelector";
import InputField from "../Shared/InputField";

import { shippingConditionsArr } from "constants/shippingConditionsArr";
import { packingConditionsArr } from "constants/packingConditionsArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";
import SelectWithTextarea from "../Shared/SelectWithTextarea";

import { SupplyLocationArr } from "constants/SupplyLocationArr";
import { ShippingTypeSizeArr } from "constants/ShippingTypeSizeArr";
import SelectOption from "../Shared/SelectOption";
import SelectGroup from "../Shared/SelectGroup";
import DateTimeInput from "../Shared/DateTimeInput";

export default function PrivateLabelForm(props) {
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

  return (
    <>
      <form
        id="view"
        className="container container-req "
        onSubmit={formValidation.handleSubmit}
      >
        <div className="input-content ">
          {errorMsg?.response && (
            <div className="alert mt-3 p-2 alert-danger form-control text-dark">
              {errorMsg?.response}
            </div>
          )}

          {/* form description */}

          <div className="container container-po ">
            <div className="input-content ">
              <div className="row row-container w-100  align-content-center">
                <div className="title-text w-100 ">
                  <h5>Private Label Details</h5>
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
                      isRequired={false}
                    />
                  </div>
                )}
                {/* newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww */}
                <div className="col-md-6 col-sm-12">
                  <InputField
                    isRequired={true}
                    title={"quantity"}
                    formValidation={formValidation}
                    vlaidationName={"quantity"}
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
                    vlaidationName={"qualityConditions"}
                    textAreaOther={"qualityConditionsOther"}
                    isRequired={true}
                    title={"Quality Condition"}
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
                  title="Trademark documents"
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
                  meidaAcceptedExtensions={["pdf", "png", "jpeg", "jpg"]}
                  setErrorMsg={setErrorMsg}
                  title="Upload Documents"
                />

                <div className="col-12 action py-0">
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

                          if (targetElement) {
                            targetElement.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          } else {
                            const targetElement = document.getElementById(
                              "view"
                            );
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
                      Send
                    </button>
                  )}
                </div>
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
