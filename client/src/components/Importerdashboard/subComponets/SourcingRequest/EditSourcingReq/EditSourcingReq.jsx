import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormValidation } from "./hooks/useFormValidation";
import SpecialChar from "components/Forms/Shared/SpecialChar/SpecialChar";
import InputField from "components/Forms/Shared/InputField";
import TextareaInput from "components/Forms/Shared/TextareaInput";
import { updateProduct } from "Services/products";
import SuccessToast from "components/SuccessToast";
import { useFetchData } from "./hooks/useFetchData";
import { packingConditionsArr } from "constants/packingConditionsArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";
import { shippingConditionsArr } from "constants/shippingConditionsArr";

import SelectWithTextarea from "components/Forms/Shared/SelectWithTextarea";
import DateTimeInput from "components/Forms/Shared/DateTimeInput";
import useWorldCountries from "hooks/useWorldCountries";
import { updateSourcingRequest } from "Services/sourcingReuqest";

export default function EditSourcingReq() {
  let navigate = useNavigate();
  const allCountries = useWorldCountries();
  const [errorMsg, setErrorMsg] = useState();
  // const [requestedData, setrequestedData] = useState();
  let { requestedData, apiLoadingData, isLogin } = useFetchData();
  const [isLoading, setIsLoading] = useState(false);
  const { formValidation, initialValues } = useFormValidation(
    requestedData,
    submitForm
  );

  async function submitForm(values) {
    setIsLoading(true);

    // clear error message
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });
    let {
      productName,
      quantity,
      productDescription,
      shippingConditions,
      shippingConditionsOther,
      packingConditions,
      packingConditionsOther,
      qualityConditionsOther,
      qualityConditions,

      deadline,
      otherInfoRequest,
    } = values;

    let data = {
      productName,
      quantity,
      productDescription,

      ...(deadline && { deadline: deadline }),
      ...(otherInfoRequest && { otherInfoRequest: otherInfoRequest }),
      shippingConditions:
        shippingConditions == "other"
          ? shippingConditionsOther
          : shippingConditions,

      packingConditions:
        packingConditions == "other"
          ? packingConditionsOther
          : packingConditions,
      qualityConditions:
        qualityConditions == "other"
          ? qualityConditionsOther
          : qualityConditions,
      specialCharacteristics: {},
    };
    if (values.country.length !== 0) {
      data.preferredCountries = values.country;
    }
    if (Object.keys(values.productCharacteristic).length != 0) {
      // create an object with the keyword property as the key and the value property as the value.
      const obj = Object.fromEntries(
        values.productCharacteristic.map((obj) => [obj.keyword, obj.value])
      );
      data.specialCharacteristics = obj;
    }

    const response = await updateSourcingRequest(
      requestedData?.id,
      {
        authorization: isLogin,
      },
      data
    );

    if (response?.success) {
      setIsLoading(true);
      SuccessToast("data updated successfuly");
      navigate(
        `/importerdashboard/sourcingReq/moreDetails?sourcingReqId=${requestedData?.id}&productName=${data?.productName}`
      );
    }
    //  else {
    setErrorMsg((prevErrors) => ({
      ...prevErrors,
      message: response?.error,
    }));
    const targetElement = document.getElementById("view");
    if (targetElement)
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    setIsLoading(false);
  }

  useEffect(() => {
    if (requestedData && requestedData?.length !== 0) {
      formValidation.setValues(initialValues);
    }
  }, [requestedData]);

  // if (
  //   currentUserData?.factoryVerified == "0" ||
  //   currentUserData?.factoryEmailActivated == false
  // ) {
  //   return <FactoryUnVerified />;
  // }

  return (
    <div id="view" className="m-4 order-section  ">
      <div>
        <div className=" d-flex justify-content-between align-items-center ">
          <h2>
            Edit Sourcing Request {`=>`} {requestedData?.productName}
          </h2>

          <div className="btn-container">
            <button
              type="button"
              className="order-btn-1"
              onClick={() => navigate("/importerdashboard/AllSourcingRequests")}
            >
              <p className="cursor">All Sourcing Request</p>
            </button>
          </div>
        </div>
      </div>
      {/* section 1 */}
      <form onSubmit={formValidation.handleSubmit} className="header w-100">
        {/* <form className="header w-100"> */}

        {/* ------------ */}
        <div className="container  add-product-dash ">
          <div className="row row-gap-12 w-100 ">
            {errorMsg?.message && (
              <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                {errorMsg.message}
              </div>
            )}

            <div className="col-4">
              <InputField
                isRequired={true}
                title={"Product Name"}
                formValidation={formValidation}
                vlaidationName={"productName"}
              />
            </div>
            <div className="col-4">
              <InputField
                isRequired={true}
                title={"Quantity "}
                formValidation={formValidation}
                vlaidationName={"quantity"}
              />
            </div>

            <div className="col-4">
              <SelectWithTextarea
                formValidation={formValidation}
                vlaidationName={"shippingConditions"}
                textAreaOther={"shippingConditionsOther"}
                isRequired={false}
                title={"shipping conditions"}
                array={shippingConditionsArr}
              />
            </div>

            <div className="col-4">
              <SelectWithTextarea
                formValidation={formValidation}
                vlaidationName={"packingConditions"}
                textAreaOther={"packingConditionsOther"}
                isRequired={false}
                title={"Packing conditions"}
                array={packingConditionsArr}
              />
            </div>

            <div className="col-4">
              <SelectWithTextarea
                formValidation={formValidation}
                vlaidationName={"qualityConditions"}
                textAreaOther={"qualityConditionsOther"}
                isRequired={false}
                title={"Quality Conditions"}
                array={qualityConditionsArr}
              />
            </div>

            <div className="col-4">
              <DateTimeInput
                isRequired={false}
                title={"Form Deadline"}
                formValidation={formValidation}
                vlaidationName={"deadline"}
              />
            </div>

            <div className="col-4">
              <div className="form-group">
                <label forhtml="country">Select Countries</label>

                <button
                  className="btn form-control dropdown-toggle w-100 text-center countries-drop d-flex "
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <p> Select Countries</p>
                  <i className="fa-solid fa-chevron-down text-end my-auto"></i>
                  {/* {Dropdown} */}
                </button>
                <ul className="dropdown-menu col-3 scroller">
                  {allCountries.map((item) => (
                    <li>
                      <div className=" dropdown-item d-flex justify-content-start align-items-center width-drop">
                        <input
                          onChange={formValidation.handleChange}
                          className="form-check-input cursor me-3 "
                          type="checkbox"
                          name="country"
                          id="country"
                          value={item.code}
                        />
                        <label
                          className="form-check-label p-0 m-0"
                          htmlFor="country"
                        >
                          {item.name}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>

                {/*  */}
              </div>
            </div>

            {/* ---------------------------- */}
            <div className="col-12 ms-3 ">
              <div className="border-row row">
                <div>
                  <label className="pb-2">Product Characteristics</label>
                </div>

                <SpecialChar
                  formValidation={formValidation}
                  vlaidationName="productCharacteristic"
                />
              </div>
            </div>

            {/* ----------------------------------------- */}

            <TextareaInput
              vlaidationName="productDescription"
              formValidation={formValidation}
              isRequired={true}
              title="product Description"
            />

            <TextareaInput
              vlaidationName="otherInfoRequest"
              formValidation={formValidation}
              isRequired={false}
              title="Other Information"
            />

            <div className="col-12">
              {isLoading ? (
                <button
                  type="button"
                  className="main mx-auto d-block px-5   rounded-3 border-0"
                >
                  <i className="fas fa-spinner fa-spin px-2"></i>
                </button>
              ) : (
                <button
                  className="defualt-btn main d-block mx-auto"
                  type="submit"
                  onClick={() => {
                    if (formValidation.isValid == false) {
                      const targetElement = document.getElementById(
                        Object.keys(formValidation.errors)?.[0]
                      );

                      // Scroll to the target element
                      if (targetElement)
                        targetElement.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                    }
                  }}
                >
                  {/* <i className="fa-solid fa-plus me-1"></i> */}
                  Update product
                </button>
              )}
            </div>
          </div>
        </div>
        {/* ------------ */}
      </form>
    </div>
  );
}
