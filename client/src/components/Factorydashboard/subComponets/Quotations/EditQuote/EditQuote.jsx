import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

// auth
import { UserToken } from "Context/userToken";
import { GlobalMsgContext } from "Context/globalMessage";

// functions
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import { AddQuoteUpdates, updateQoute } from "Services/quotations";
import InputField from "components/Forms/Shared/InputField";
import SelectWithTextarea from "components/Forms/Shared/SelectWithTextarea";
import TextareaInput from "components/Forms/Shared/TextareaInput";
import TimeLine from "components/Forms/Shared/TimeLine/TimeLine";
import SelectGroup from "components/Forms/Shared/SelectGroup";
import { SupplyLocationArr } from "constants/SupplyLocationArr";
import { ShippingTypeSizeArr } from "constants/ShippingTypeSizeArr";
import { packingConditionsArr } from "constants/packingConditionsArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";
import { paymentTypeArr } from "constants/paymentTypeArr";
import { shippingConditionsArr } from "constants/shippingConditionsArr";
import DateTimeInput from "components/Forms/Shared/DateTimeInput";
import SelectOption from "components/Forms/Shared/SelectOption";
import useOneQuote from "./hooks/useOneQuote";
import useFormValidation from "./hooks/useFormValidation";
export default function EditQuote() {
  let { isLogin } = useContext(UserToken);
  let { setGlobalMsg } = useContext(GlobalMsgContext);

  let { quoteId } = useParams();
  let navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState();
  const [isLoading, setIsLoading] = useState(false);
  let { apiDetails } = useOneQuote();
  let { formValidation } = useFormValidation(
    apiDetails,
    submitForm,
    qualityConditionsArr,
    paymentTypeArr,
    ShippingTypeSizeArr,
    packingConditionsArr
  );

  async function submitForm(textValue) {
    setIsLoading(true);

    // clear error message
    setErrorMsg((prevErrors) => {
      const { response, ...restErrors } = prevErrors || {};
      return restErrors;
    });

    // text daTA
    let data = {
      minQuantity: textValue.minQuantity,
      price: textValue.price,

      qualityConditions:
        textValue.qualityConditions == "other"
          ? textValue.qualityConditionsOther
          : textValue.qualityConditions,

      shippingConditions:
        textValue.packingConditions == "other"
          ? textValue.shippingConditionsOther
          : textValue.shippingConditions,

      packingConditions:
        textValue.packingConditions === "other"
          ? textValue.packingConditionsOther
          : textValue.packingConditions,

      paymentTerms:
        textValue.paymentType == "other"
          ? textValue.paymentTypeOther
          : textValue.paymentType,

      notes: textValue.notes,

      discounts: textValue.discounts,
      timeLine: textValue.timeLine,
      supplyLocation: textValue?.SupplyLocation,
      deadline: textValue.deadline,
    };

    const uniqueData = {};

    const forbiddenKeys = [
      "status",
      "createdAt",
      "updatedAt",
      "id",
      "importerId",
      "factoryId",
      "quotationRequestId",
      "sourcingRequestId",
      "specialManufacturingRequestId",
      "privateLabelingId",
      "whiteLabelingId",
    ];

    let getOldData = Object.keys(apiDetails)
      .filter((key) => !forbiddenKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = apiDetails[key];
        return obj;
      }, {});
    getOldData["deadline"] = apiDetails?.deadline?.split(".")?.[0];

    for (const key in getOldData) {
      if (getOldData[key] != data[key]) {
        uniqueData[key] = getOldData[key];
      }
    }
    // console.log("getOldData-old getOldData", getOldData);

    // console.log("getOldData-old values", uniqueData);
    // console.log("getOldData data new values", data);
    // return console.log("getOldData data new values", getOldData);
    // return;

    // return console.log("uniqueData",getOldData)
    let oldData = {
      ...uniqueData,
      // price: apiDetails?.price,
      quotationId: apiDetails?.id,
    };

    console.log("uniqueData", oldData);
    // return
    // console.log("uniqueData oldData", getOldData);
    // setIsLoading(false);

    // return console.log("uniqueData",uniqueData);

    let result = await updateQoute(
      quoteId,
      {
        authorization: isLogin,
      },
      data
    );
    let result2 = await AddQuoteUpdates(
      {
        authorization: isLogin,
      },
      oldData
    );
    // console.log("result2----------", result2);

    if (result?.success && result2?.success) {
      setIsLoading(true);
      setGlobalMsg("Quotation is updated Successfully");
      navigate(-2);
    } else {
      setIsLoading(false);
      setErrorMsg((prevErrors) => ({
        ...prevErrors,
        message: result?.error || result2?.error,
      }));
      // return;
    }
    const targetElement = document.getElementById("view");
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  return (
    <div id="view" className="m-4 order-section  ">
      <SubPageUtility
        currentPage="More Details"
        PrevPage="Private Label Details"
      />
      {/* section 1 */}
      <form onSubmit={formValidation.handleSubmit} className="header w-100">
        <div>
          <div className=" d-flex justify-content-between align-items-center ">
            <h2>Edit Quotation</h2>

            <div className="btn-container">
              <button
                type="button"
                className="order-btn-1"
                onClick={() => navigate("/factorydashboard/quotations")}
              >
                <p className="cursor">All Quotations</p>
              </button>
            </div>
          </div>
        </div>

        {/* ------------ */}
        <div className="container  add-product-dash">
          <div className="row row-container w-100 ">
            {errorMsg?.message && (
              <div className="alert mt-3 p-2 alert-danger form-control text-dark">
                {errorMsg.message}
              </div>
            )}

            <div className="col-4">
              <InputField
                title={"Total Quantity *"}
                formValidation={formValidation}
                vlaidationName={"minQuantity"}
              />
            </div>

            <div className="col-4">
              <InputField
                title={"Price *"}
                formValidation={formValidation}
                vlaidationName={"price"}
              />
            </div>

            <div className="col-4">
              <InputField
                isRequired={false}
                title={"Discounts"}
                formValidation={formValidation}
                vlaidationName={"discounts"}
              />
            </div>
            <div className="col-4">
              <DateTimeInput
                isRequired={true}
                title={"Form Deadline"}
                formValidation={formValidation}
                vlaidationName={"deadline"}
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
                vlaidationName={"packingConditions"}
                textAreaOther={"packingConditionsOther"}
                isRequired={true}
                title={"Packing condition"}
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

            <div className="col-4">
              <SelectOption
                formValidation={formValidation}
                vlaidationName={"SupplyLocation"}
                isRequired={true}
                title={"Supply Location"}
                array={SupplyLocationArr}
              />
            </div>
            <div className="col-md-4 col-sm-12">
              <SelectGroup
                formValidation={formValidation}
                vlaidationName="ShippingTypeSize"
                textAreaOther={"ShippingTypeSizeOther"}
                isRequired={true}
                title={"Shipping Type and Size"}
                array={ShippingTypeSizeArr}
              />
            </div>

            <TimeLine
              formValidation={formValidation}
              vlaidationName={"timeLine"}
            />

            {/* ------------------------------------------ */}
            <TextareaInput
              vlaidationName="notes"
              formValidation={formValidation}
              isRequired={false}
              title="More Details"
            />

            <div className="col-12">
              {isLoading ? (
                <button
                  type="button"
                  className="order-btn-2 px-5 rounded-3 d-block mx-auto"
                >
                  <i className="fas fa-spinner fa-spin px-2"></i>
                </button>
              ) : (
                <button
                  className="btn-submit rounded-3 text-white bg-main "
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
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
