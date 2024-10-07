import { useEffect, useState, useContext } from "react";
import useCategories from "hooks/useCategory";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";
import { useNavigate, useParams } from "react-router-dom";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedDash";
import { useFormValidation } from "./hooks/useFormValidation";
import { packingConditionsArr } from "constants/packingConditionsArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";
import { shippingConditionsArr } from "constants/shippingConditionsArr";
import { paymentTypeArr } from "constants/paymentTypeArr";
// import { ShippingType SizeArr } from "constants/ShippingTypeSizeArr";
import InputField from "components/Forms/Shared/InputField";
import TextareaInput from "components/Forms/Shared/TextareaInput";
import SuccessToast from "components/SuccessToast";
import { useFetchOneOffer } from "hooks/useFetchOneOffer";
import SelectWithTextarea from "components/Forms/Shared/SelectWithTextarea";
import FormVlaidtionError from "components/Forms/Shared/FormVlaidtionError";
import { useFetchFactoryPrdoucts } from "hooks/useFetchFactoryPrdoucts";
import useCountries from "hooks/useCountries";
import { updateSourcingOffer } from "Services/sourcingOffer";

export default function EditOffer() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  let { offerId } = useParams();
  const categories = useCategories();
  let navigate = useNavigate();
  const countriesMiddleEast = useCountries();

  const [errorMsg, setErrorMsg] = useState();
  let { offerDetails, error: errorLoadingProducts } = useFetchOneOffer(
    offerId,
    ""
  );

  const [isLoading, setIsLoading] = useState(false);
  const { formValidation } = useFormValidation(offerDetails, submitForm);
  const { factoryProducts, error } = useFetchFactoryPrdoucts(
    currentUserData?.factoryId,
    {}
  );

  async function submitForm(values) {
    // clear error message
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    let {
      productName,
      productDescription,
      price,
      quantity,
      productHSNCode,
      country,
      productId,

      //
      shippingConditionsOther,
      shippingConditions,
      //
      paymentType,
      paymentTypeOther,

      qualityConditions,
      qualityConditionsOther,
      //
      packingConditions,
      packingConditionsOther,
    } = values;

    let data = {
      price,
      productName,
      productDescription,
      quantity,

      ...(productHSNCode && { productHSNCode: productHSNCode }),
      ...(values.preferredCountries.length !== 0 && {
        preferredCountries: country,
      }),
      ...(productId && { productId: productId }),
      shippingConditions:
        shippingConditions == "other"
          ? shippingConditionsOther
          : shippingConditions,
      //done
      packingConditions:
        packingConditions == "other"
          ? packingConditionsOther
          : packingConditions,
      //done
      qualityConditions:
        qualityConditions == "other"
          ? qualityConditionsOther
          : qualityConditions,

      //done
      paymentTerms: paymentType == "other" ? paymentTypeOther : paymentType,
    };

    const response = await updateSourcingOffer(
      offerDetails?.id,
      {
        authorization: isLogin,
      },
      data
    );

    if (response?.success) {
      setIsLoading(true);
      SuccessToast("data updated successfuly");
      navigate(
        `/factorydashboard/offers/moreDetails?factoryOffersId=${response?.data?.sourcingoffers?.id}&productName=${response?.data.sourcingoffers?.productName}`
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



  if (
    currentUserData?.factoryVerified == "0" ||
    currentUserData?.factoryEmailActivated == false
  ) {
    return <FactoryUnVerified />;
  }

  return (
    <div id="view" className="m-4 order-section  ">
      {/* section 1 */}
      <form onSubmit={formValidation.handleSubmit} className="header w-100">
        {/* <form className="header w-100"> */}
        <div>
          <div className=" d-flex justify-content-between align-items-center ">
            <h2>Edit Product {offerDetails?.productName}</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => navigate("/factorydashboard/AllFactoryProducts")}
              >
                <p className="cursor">All Products</p>
              </button>
            </div>
          </div>
        </div>

        {/* ------------ */}
        <div className="container  add-product-dash ">
          <div className="row row-gap-12 w-100 ">
            {errorMsg?.message && (
              <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                {errorMsg?.message}
              </div>
            )}
            <div className="col-4">
              <InputField
                isRequired={true}
                title="Product Name"
                formValidation={formValidation}
                vlaidationName="productName"
              />
            </div>

            <div className="col-4">
              <div className="form-group">
                <label className="form-title">Factory Products</label>
                <select
                  className="form-select form-control"
                  onChange={formValidation.handleChange}
                  id="productId"
                  onBlur={formValidation.handleBlur}
                  value={formValidation.values.productId}
                >
                  <option value="">Select from Factory Product</option>
                  {factoryProducts?.map((item) => (
                    <option value={item?.id}>{item?.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-4">
              <div className="form-group">
                <label forhtml="country">Select preferred Countries</label>

                {/*  */}
                <button
                  className="btn  dropdown-toggle w-100 text-start select-countries "
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Exporting Countires
                  {/* {Dropdown} */}
                </button>
                <ul className="dropdown-menu col-3 scroller">
                  {countriesMiddleEast.map((item) => (
                    <li>
                      <div className=" dropdown-item d-flex justify-content-start align-items-center width-drop">
                        <input
                          //   onClick={(e) => SelectedCountry(e)}
                          onChange={formValidation.handleChange}
                          className="form-check-input cursor me-3 "
                          type="checkbox"
                          // name="preferredCountries"
                          id="preferredCountries"
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

           

            <div className="col-4">
              <InputField
                isRequired={true}
                title="Price"
                formValidation={formValidation}
                vlaidationName="price"
              />
            </div>

            <div className="col-4">
              <InputField
                isRequired={false}
                title="hsn Code"
                formValidation={formValidation}
                vlaidationName="productHSNCode"
              />
            </div>

            <div className="col-4">
              <InputField
                isRequired={true}
                title="Quantity"
                formValidation={formValidation}
                vlaidationName="quantity"
              />
            </div>

            {/* ---------------------------- */}
            <div className="col-4">
              <SelectWithTextarea
                formValidation={formValidation}
                vlaidationName={"qualityConditions"}
                textAreaOther={"qualityConditionsOther"}
                isRequired={true}
                title={"Quality Conditions"}
                array={qualityConditionsArr}
              />
            </div>

            <div className="col-4">
              <SelectWithTextarea
                formValidation={formValidation}
                vlaidationName={"paymentType"}
                textAreaOther={"paymentTypeOther"}
                isRequired={true}
                title={"payment Term"}
                array={paymentTypeArr}
              />
            </div>

            <div className="col-4">
              <SelectWithTextarea
                formValidation={formValidation}
                vlaidationName="packingConditions"
                textAreaOther="packingConditionsOther"
                isRequired={true}
                title={"Packing conditions"}
                array={packingConditionsArr}
              />
            </div>

            <div className="col-4 ">
              <SelectWithTextarea
                formValidation={formValidation}
                vlaidationName={"shippingConditions"}
                textAreaOther={"shippingConditionsOther"}
                isRequired={true}
                title={"shipping conditions"}
                array={shippingConditionsArr}
              />
            </div>

            <TextareaInput
              formValidation={formValidation}
              vlaidationName="productDescription"
              isRequired="true"
              title="Product Description"
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
                  <i className="fa-solid fa-plus me-1"></i>
                  Add product
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
