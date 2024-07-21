import FormVlaidtionError from "./FormVlaidtionError";
import PropTypes from "prop-types";
export default function ProductMultiSelector(props) {
  let {
    productDetails,
    formValidation,
    setSelectedItem,
    vliadationNameOnName,
    vlaidationNameOnId,
    isRequired,
  } = props;

  // const handleCheckboxProductNameChange = (name, isChecked, id) => {
  const handleRadioProductNameChange = (name, id) => {
    // let productNameArr = formValidation?.values?.productName;

    // let updatedProductNames;
    // if (isChecked) {
    //   productNameArr.push(item);
    // } else {
    //   productNameArr = productNameArr.filter((name) => name != item);
    // }
    // formValidation.setFieldValue(vliadationNameOnName, productNameArr);

    formValidation.setFieldValue(vliadationNameOnName, name);
    formValidation.setFieldValue(vlaidationNameOnId, id);
  };

  return (
    <>
      <div className="form-group">
        <label>selected product {isRequired && "*"}</label>
        <button
          className="btn form-control dropdown-toggle w-100 text-center countries-drop d-flex rounded"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <p>
            {" "}
            {formValidation.values[vlaidationNameOnId] != ""
              ? formValidation.values[vliadationNameOnName]
              : "Select Product"}{" "}
          </p>
          <i className="fa-solid fa-chevron-down text-end my-auto"></i>
        </button>
        <ul className="dropdown-menu col-3 scroller">
          {productDetails?.map((item, index) => (
            <li>
              <div className=" dropdown-item d-flex justify-content-start align-items-center width-drop bg-none">
                <label className="form-check-label p-0 m-0  d-flex w-100">
                  <input
                    //

                    // onChange={(e) => {
                    //   handleRadioProductNameChange(item?.name, item?.id);
                    //   formValidation.handleChange(e);
                    // }}

                    onChange={(e) => {
                      handleRadioProductNameChange(item?.name, item?.id);
                      formValidation.handleChange(e);
                    }}
                    onBlur={formValidation.handleBlur}
                    onClick={(e) => {
                      handleRadioProductNameChange(item?.name, item?.id);
                      formValidation.handleChange(e);
                    }}
                    // className="form-check-input cursor me-3 "
                    // className="form-input cursor me-3 "
                    className="form-control cursor border-0 bg-transparent"
                    // type="checkbox"
                    // type="radio"
                    type="text"
                    id={vliadationNameOnName}
                    name={vliadationNameOnName}
                    value={item.name}
                    readOnly
                  />
                  {/* {item.name} */}
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

ProductMultiSelector.propTypes = {
  isRequired: PropTypes.bool,
};

ProductMultiSelector.defaultProps = {
  isRequired: true,
};
