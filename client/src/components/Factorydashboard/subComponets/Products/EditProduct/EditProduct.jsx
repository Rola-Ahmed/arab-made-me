import { useEffect, useState, useContext } from "react";
import useCategories from "hooks/useCategory";
import { UserToken } from "Context/userToken";
import { userDetails } from "Context/userType";

import { useNavigate, useParams } from "react-router-dom";
import FactoryUnVerified from "components/ActionMessages/FactoryUnVerified/FactoryUnVerifiedDash";
import { useFormValidation } from "./hooks/useFormValidation";
import SpecialChar from "components/Forms/Shared/SpecialChar/SpecialChar";
import { useFetchOneProduct } from "hooks/useFetchOneProduct";
import InputField from "components/Forms/Shared/InputField";
import TextareaInput from "components/Forms/Shared/TextareaInput";
import { updateProduct } from "Services/products";
import SuccessToast from "components/SuccessToast";

export default function EditProduct() {
  let { isLogin } = useContext(UserToken);
  let { currentUserData } = useContext(userDetails);
  let { productId } = useParams();
  const categories = useCategories();
  let navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState();
  // const [productDetails, setProductDetails] = useState();
  let { productDetails, error: errorLoadingProducts } = useFetchOneProduct(
    productId
  );
  const [isLoading, setIsLoading] = useState(false);
  const { formValidation, initialValues } = useFormValidation(
    productDetails,
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
      country,
      name,
      sectorId,
      categoryId,
      description,
      price,
      hsnCode,
      minOrderQuantity,
      city,
      guarantee,
      maxOrderQuantity,
    } = values;

    let data = {
      country,
      name,

      categoryId,
      sectorId,

      description,
      price,
      minOrderQuantity,

      specialCharacteristics: {},
      ...(hsnCode && { hsnCode: hsnCode }),
      ...(guarantee && { guarantee: guarantee }),
      ...(maxOrderQuantity && { maxOrderQuantity: maxOrderQuantity }),
      ...(city && { city: city }),
    };

    if (
      Object.keys(values.productCharacteristic).length != 0 &&
      Object.keys(values.productCharacteristic) != ""
    ) {
      // create an object with the keyword property as the key and the value property as the value.
      const obj = Object.fromEntries(
        values.productCharacteristic.map((obj) => [obj.keyword, obj.value])
      );
      data.specialCharacteristics = obj;
    }

    const response = await updateProduct(
      productDetails?.id,
      {
        authorization: isLogin,
      },
      data
    );

    if (response?.success) {
      setIsLoading(true);
      SuccessToast("data updated successfuly");
      navigate(
        `/factorydashboard/product/moreDetails?productId=${productDetails?.id}&productName=${data?.name}`
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
    if (productDetails && productDetails?.length !== 0) {
      formValidation.setValues(initialValues);
    }
  }, [productDetails]);

  if (
    currentUserData?.factoryVerified == "0" ||
    currentUserData?.factoryEmailActivated == false
  ) {
    return <FactoryUnVerified />;
  }

  return (
    <>
      <div id="view" className="m-4 order-section  ">
        {/* section 1 */}
        <form onSubmit={formValidation.handleSubmit} className="header w-100">
          {/* <form className="header w-100"> */}
          <div>
            <div className=" d-flex justify-content-between align-items-center ">
              <h2>Add New Product</h2>

              <div className="btn-container">
                <button
                  type="button"
                  className="order-btn-1"
                  onClick={() =>
                    navigate("/factorydashboard/AllFactoryProducts")
                  }
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
                  {errorMsg.message}
                </div>
              )}
              <div className="col-4">
                <InputField
                  isRequired={true}
                  title="Product Name"
                  formValidation={formValidation}
                  vlaidationName={"name"}
                />
              </div>

              <div className="col-4">
                <div className="form-group">
                  <label>Sector</label>

                  <select
                    className="form-select form-control py-2"
                    onChange={formValidation.handleChange}
                    id="sectorId"
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.sectorId}
                    onClick={(e) => {
                      let selectedProductName = "";
                      categories?.find(
                        (item) =>
                          item.sectorId == e.target.value
                            ? (selectedProductName = item.id)
                            : ""
                        // )
                      );

                      formValidation.setFieldValue(
                        "categoryId",
                        selectedProductName
                      ); // Assuming 'productName' is the field name for product name
                    }}
                  >
                    {categories?.map((item) => (
                      // <option value={item?.id}>{item?.name}</option>

                      <optgroup label={item?.name}>
                        <option value={item?.sector?.id}>
                          {item?.sector?.name}
                        </option>
                      </optgroup>
                    ))}
                  </select>
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
                  vlaidationName="hsnCode"
                />
              </div>

              <div className="col-4">
                <InputField
                  isRequired={false}
                  title="guarantee"
                  formValidation={formValidation}
                  vlaidationName="guarantee"
                />
              </div>

              <div className="col-4">
                <InputField
                  isRequired={true}
                  title="min Order Quantity"
                  formValidation={formValidation}
                  vlaidationName="minOrderQuantity"
                />
              </div>

              <div className="col-4">
                <InputField
                  isRequired={true}
                  title="Ability To Production"
                  formValidation={formValidation}
                  vlaidationName="maxOrderQuantity"
                />
              </div>

              {/* ---------------------------- */}

              <div className="col-12 ms-3 ">
                <div className="border-row row">
                  <label className="pb-2">Product Characteristics</label>

                  <SpecialChar
                    formValidation={formValidation}
                    productCharacteristic="productCharacteristic"
                  />
                </div>
              </div>

              <TextareaInput
                formValidation={formValidation}
                vlaidationName="description"
                isRequired="true"
                title="description"
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
    </>
  );
}
