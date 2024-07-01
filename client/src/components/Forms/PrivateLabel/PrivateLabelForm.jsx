import React, { useState } from "react";

import SharedConditionsValidate from "../Shared/SharedConditionsValidate";
import TextareaInput from "../Shared/TextareaInput";
import EtcProductPopUp from "../Shared/EtcProductPopUp";
import UploadDocument from "../Shared/UploadDocument";
import FormVlaidtionError from "../Shared/FormVlaidtionError";
import Trademakr from "../Shared/Trademakr";

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
                {/* {Object?.keys(oneProductDetails)?.length === 0 ? ( */}
                {!productIsSelected && (
                  <div className="col-12">
                    <div className="form-group">
                      <label>selected product</label>

                      <button
                        className="btn form-control dropdown-toggle w-100 text-center countries-drop d-flex "
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <p> Select Product *</p>
                        <i className="fa-solid fa-chevron-down text-end my-auto"></i>
                        {/* {Dropdown} */}
                      </button>
                      <ul className="dropdown-menu col-3 scroller">
                        {allProductsArr?.map((item) => (
                          <li>
                            <div className=" dropdown-item d-flex justify-content-start align-items-center width-drop bg-none">
                              <input
                                //
                                onChange={formValidation.handleChange}
                                onBlur={formValidation.handleBlur}
                                // value={formValidation.values.productId}
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
                              <label
                                className="form-check-label p-0 m-0 justify-content-between d-flex w-100"
                                htmlFor="productId"
                              >
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
                {/* newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww */}

                <SharedConditionsValidate
                  formValidation={formValidation}
                  quantityTitle="Quantity"
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

                        targetElement.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
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
