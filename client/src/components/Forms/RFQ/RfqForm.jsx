import React, { useState } from "react";

import { shippingConditionsArr } from "constants/shippingConditionsArr";

import { packingConditionsArr } from "constants/packingConditionsArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";

import EtcProductPopUp from "../Shared/EtcProductPopUp";

import "./RFQ.css";
import SelectOption from "../Shared/SelectOption";
import { paymentTypeArr } from "constants/paymentTypeArr";
import UploadDocument from "../Shared/UploadDocument";
import TextareaInput from "../Shared/TextareaInput";
import FormVlaidtionError from "../Shared/FormVlaidtionError";

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

  const handleCheckboxProductNameChange = (item, isChecked) => {
    let productNameArr = formValidation?.values?.productName;

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
                  <div className="form-group">
                    <label>selected product *</label>

                    <button
                      className="btn form-control dropdown-toggle w-100 text-center countries-drop d-flex rounded"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <p> Select Product *</p>
                      <i className="fa-solid fa-chevron-down text-end my-auto"></i>
                    </button>
                    <ul className="dropdown-menu col-3 scroller">
                      {productDetails.map((item) => (
                        <li>
                          <div className=" dropdown-item d-flex justify-content-start align-items-center width-drop bg-none">
                            <label className="form-check-label p-0 m-0  d-flex w-100">
                              <input
                                //
                                onChange={formValidation.handleChange}
                                onBlur={formValidation.handleBlur}
                                onClick={(e) => {
                                  formValidation.handleChange(e);
                                  handleCheckboxProductNameChange(
                                    item.name,
                                    e.target.checked
                                  );
                                }}
                                className="form-check-input cursor me-3 "
                                type="checkbox"
                                id="productId"
                                name="productId"
                                value={item.id}
                              />
                              {item.name}
                            </label>
                            <button
                              type="button"
                              class="fa-solid fa-circle-info ps-3 bg-none border-0 p-0 m-0"
                              title="view product details"
                              onClick={() => {
                                setSelectedItem(item.id);
                              }}
                            ></button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <FormVlaidtionError
                    formValidation={formValidation}
                    vlaidationName="productId"
                  />
                </div>
              )}

              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="quantity">quantity *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="quantity"
                    name="quantity"
                    placeholder="Enter Product Quantity"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.quantity}
                  />
                  {formValidation.errors.quantity &&
                  formValidation.touched.quantity ? (
                    <small className="form-text text-danger">
                      {formValidation.errors.quantity}
                    </small>
                  ) : (
                    ""
                  )}
                </div>
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
                  vlaidationName={"qualityConditions"}
                  textAreaOther={"qualityConditionsOther"}
                  isRequired={true}
                  title={"Quality Condition"}
                  array={qualityConditionsArr}
                />
              </div>

              <div className="col-md-6 col-sm-12">
                <SelectOption
                  formValidation={formValidation}
                  vlaidationName={"paymentType"}
                  textAreaOther={"paymentTypeOther"}
                  isRequired={true}
                  title={"payment Term"}
                  array={paymentTypeArr}
                />
              </div>

              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="DeadLine">DeadLine *</label>
                  <input
                    id="deadLine"
                    name="deadLine"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.deadLine}
                    type="datetime-local"
                    className="form-control d-block"
                  />
                </div>
                {formValidation.errors.deadLine &&
                formValidation.touched.deadLine ? (
                  <small className="form-text text-danger">
                    {formValidation.errors.deadLine}
                  </small>
                ) : (
                  ""
                )}
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
                        targetElement.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
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
