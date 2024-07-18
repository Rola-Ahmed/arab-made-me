import { useState } from "react";

import { shippingConditionsArr } from "constants/shippingConditionsArr";

import { packingConditionsArr } from "constants/packingConditionsArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";

import EtcProductPopUp from "../Shared/EtcProductPopUp";

import "./RFQ.css";
import SelectWithTextarea from "../Shared/SelectWithTextarea";
import { paymentTypeArr } from "constants/paymentTypeArr";
import UploadDocument from "../Shared/UploadDocument";
import TextareaInput from "../Shared/TextareaInput";
import ProductMultiSelector from "../Shared/ProductMultiSelector";
import InputField from "../Shared/InputField";
import DateTimeInput from "../Shared/DateTimeInput";

function RfqForm(props) {
  let {
    isLoading,
    productDetails,
    formValidation,
    errorMsg,
    setSelectedDocs,
    setErrorMsg,
    selectedDocs,
    productIsSelected,
  } = props;

  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <>
      <div className="container container-rfq">
        <div className="input-content ">
          {errorMsg?.response && (
            <div
              id="errorMsg"
              className=" alert mt-3 p-2 alert-danger form-control text-dark"
            >
              {errorMsg?.response}
            </div>
          )}
          <form
            onSubmit={formValidation.handleSubmit}
            className="w-100"
            encType="multipart/form-data"
          >
            <div className="row row-container w-100 mx-auto ">
              {!productIsSelected && (
                <div className="col-12">
                  <ProductMultiSelector
                    productDetails={productDetails}
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
                  title={"quantity"}
                  formValidation={formValidation}
                  vlaidationName={"quantity"}
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
                <DateTimeInput
                  isRequired={true}
                  title={"Deadline"}
                  formValidation={formValidation}
                  vlaidationName={"deadline"}
                />
              </div>

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

              <TextareaInput
                vlaidationName="otherInformation"
                formValidation={formValidation}
                isRequired={false}
                title="Other Information"
              />
              <div className="col-12 action">
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
                    Send RFQ
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

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

export default RfqForm;
