import React from "react";
import FormVlaidtionError from "./FormVlaidtionError";

export default function ProductMultiSelector(props) {
  let {
    productDetails,
    formValidation,
    setSelectedItem,
    vliadationNameOnName,
    vlaidationNameOnId,
  } = props;

  const handleCheckboxProductNameChange = (item, isChecked) => {
    let productNameArr = formValidation?.values?.productName;

    // let updatedProductNames;
    if (isChecked) {
      productNameArr.push(item);
    } else {
      productNameArr = productNameArr.filter((name) => name != item);
    }
    formValidation.setFieldValue(vliadationNameOnName, productNameArr);
  };

  return (
    <>
      <div className="form-group">
        <label>selected product *</label>
        <button
          className="btn form-control dropdown-toggle w-100 text-center countries-drop d-flex rounded"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <p> Select Product </p>
          <i className="fa-solid fa-chevron-down text-end my-auto"></i>
        </button>
        <ul className="dropdown-menu col-3 scroller">
          {productDetails?.map((item, index) => (
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
                    id={vlaidationNameOnId}
                    name={vlaidationNameOnId}
                    value={item.id}
                  />
                  {item.name}
                </label>
                <button
                  type="button"
                  class="fa-solid fa-circle-info ps-3 bg-none border-0 p-0 m-0"
                  title="view product details"
                  onClick={() => {
                    setSelectedItem(productDetails?.[index]);
                  }}
                ></button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <FormVlaidtionError
        formValidation={formValidation}
        vlaidationName={vlaidationNameOnId}
      />
    </>
  );
}
