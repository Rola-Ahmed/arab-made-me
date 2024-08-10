import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

// auth
import { baseUrl } from "config.js";
import { UserToken } from "Context/userToken";
import { GlobalMsgContext } from "Context/globalMessage";
import {
  requiredStringValidate,
  otherTextAreaValidate,
  requiredDateValidate,
  reqQualityValidate,
  textAreaValidate,
} from "utils/validationUtils";


// verififcation




// functions
import SubPageUtility from "components/Shared/Dashboards/SubPageUtility";
import { updateQoute } from "Services/quotations";
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

export default function EditQuote() {


  let { isLogin } = useContext(UserToken);
  let { setGlobalMsg } = useContext(GlobalMsgContext);

  let { quoteId } = useParams();
  let navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState();
  const [apiDetails, setApiDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);


  // get sectors and categrories

  async function fetchRequestData() {
    try {

      let config = {
        method: "get",
        url: `${baseUrl}/quotations/${quoteId}`,
      };

      const response = await axios.request(config);
      if (response.data.message == "done") {
        setApiDetails(response.data.quotations);
      }
    } catch (error) {}
  }



  useEffect(() => {
    if (quoteId !== undefined) {
      fetchRequestData();
    }
  }, [quoteId]);

  let validationSchema = Yup.object().shape({
    // from cilent
    // avialabe qunaitiy for user
    minQuantity: reqQualityValidate,

    price: reqQualityValidate,

    discounts: Yup.string()
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),

    packingConditions: Yup.string(),
    packingConditionsOther: otherTextAreaValidate("packingConditions", "other"),

    paymentType: Yup.string(),
    paymentTypeOther: otherTextAreaValidate("paymentType", "other"),

    qualityConditions: Yup.string().required("Input field is Required"),
    qualityConditionsOther: otherTextAreaValidate("qualityConditions", "other"),

    ShippingTypeSize: requiredStringValidate,
   ShippingTypeSizeOther: otherTextAreaValidate("ShippingTypeSize", "other"),
    
   
   
   SupplyLocation: requiredStringValidate,

    shippingConditions: requiredStringValidate,
    shippingConditionsOther: otherTextAreaValidate(
      "shippingConditions",
      "other"
    ),

    deadline: requiredDateValidate,

    timeLine: Yup.array()
      .of(
        Yup.object().shape({
          date: requiredDateValidate,
          quantity: reqQualityValidate,
        })
      )
      .min("1", "minimum length is 1"),

    notes: textAreaValidate(),
  });

  let initialValues = {
    price: apiDetails?.price || "",
    discounts: apiDetails?.discounts || 0,
    minQuantity: apiDetails?.minQuantity || "",
  
    notes: apiDetails?.notes || "",
    SupplyLocation:apiDetails?.supplyLocation,
    deadline:apiDetails?.deadline?.split('.')?.[0]||"",
    timeLine:apiDetails?.timeLine || [{date: "", quantity: ""}]
   
  };

  let formValidation = useFormik({
    initialValues,
    validationSchema,
    // validate,
    onSubmit: submitForm,
    // onSubmit: newNn,
  });

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



      shippingConditions:textValue.packingConditions === "other"?textValue.shippingConditionsOther: textValue.shippingConditions,

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
      timeLine:textValue.timeLine,
      supplyLocation:textValue?.SupplyLocation,
      deadline:textValue.deadline
    };
   

    let result = await updateQoute(quoteId,{
      authorization: isLogin,
    },data)
if (
            result?.success

          ) {
          
            setIsLoading(true);
            setGlobalMsg("Quotation is updated Successfully");

            navigate(-2);
          } else {
            setIsLoading(false);
            setErrorMsg((prevErrors) => ({
              ...prevErrors,
              message: result?.error,
            }));
            // return;
          }
          const targetElement = document.getElementById("view");
          if(targetElement){
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });}

  }

  useEffect(() => {
    if (apiDetails && apiDetails.length !== 0) {
      // quality

      const matchingItem = qualityConditionsArr?.find(
        (item) => item.value === apiDetails?.qualityConditions
      );
      // inital values
      let nameIfValueIsTrue = { 
        qualityConditions: apiDetails?.qualityConditions || "",
        qualityConditionsOther: "",
      };

      // case matchingItem is false then reset values
      if (!matchingItem) {
        nameIfValueIsTrue = {
          qualityConditions: "other",
          qualityConditionsOther: apiDetails?.qualityConditions || "",
        };
      }

      // check if payment value is set to a option "value" || or option others
      // if option others: then set paymentType value to "other" && set paymentTypeOther to the paymentType value that is coming from the database
      const initalPaymentType = paymentTypeArr?.find(
        (item) => item.value === apiDetails?.paymentType
      );
      let paymentVal = {
        // if packging condition is null   || value is not selection on option "others"
        paymentType: apiDetails?.paymentType || "",
        paymentTypeOther: "",
      };
      if (!initalPaymentType) {
        // means that data is selected to option others
        paymentVal = {
          paymentType: "other",
          paymentTypeOther: apiDetails?.paymentTerms || "",
        };
      }

      // packing condition
      const initalPackingConditions = packingConditionsArr?.find(
        (item) => item.value === apiDetails?.packingConditions
      );
      let PackingCondVal = {
        // if packging condition is null   || value is not selection on option "others"
        packingConditions: apiDetails?.packingConditions || "",
        packingConditionsOther: "",
      };
      if (!initalPackingConditions) {
        // means that data is selected to option others
        PackingCondVal = {
          packingConditions: "other",
          packingConditionsOther: apiDetails?.packingConditions || "",
        };
      }




       // shippingConditions condition
       const initalShippingConditions = ShippingTypeSizeArr?.find(
        (item) => item.value === apiDetails?.shippingSize
      );
      let ShippingCondVal = {
        // if packging condition is null   || value is not selection on option "others"
        shippingConditions: apiDetails?.shippingSize || "",
        shippingConditionsOther: "",
      };
      if (!initalShippingConditions) {
        // means that data is selected to option others
        ShippingCondVal = {
          shippingConditions: "other",
          shippingConditionsOther: apiDetails?.shippingSize || "",
        };
      }



        // ShippingTypeSize condition
        const initalShippingTypeSize = ShippingTypeSizeArr?.find(
          (item) => item.value === apiDetails?.shippingSize
        );
        let ShippingTypeCondVal = {
          // if packging condition is null   || value is not selection on option "others"
          ShippingTypeSize: apiDetails?.shippingSize || "",
          ShippingTypeSizeOther: "",
        };
        if (!initalShippingTypeSize) {
          // means that data is selected to option others
          ShippingTypeCondVal = {
            ShippingTypeSize: "other",
            ShippingTypeSizeOther: apiDetails?.shippingSize || "",
          };
        }



      initialValues = {
        ...initialValues,
        ...PackingCondVal,
        ...paymentVal,
        ...nameIfValueIsTrue,
        ...ShippingTypeCondVal,
        ...ShippingCondVal
      };

      formValidation.setValues(initialValues);
    }
  }, [apiDetails]);


  return (
    <div id="view" className="m-4 order-section  ">
      <SubPageUtility
        currentPage="More Details"
        PrevPage="Private Label Details"
      />
      {/* section 1 */}
      <form onSubmit={formValidation.handleSubmit} className="header w-100">
        {/* <form className="header w-100"> */}
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
                  // isRequired={true}
                  title={"Total Quantity *"}
                  formValidation={formValidation}
                  vlaidationName={"minQuantity"}
                />
           
            </div>

            <div className="col-4">
            <InputField
                  // isRequired={true}
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

            <div className="col-4">
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

            {/*  */}
          


            {/*  */}
            {/* ----------------------------------------- */}

            {/* ------------------------------------------ */}
            <TextareaInput
                  vlaidationName="notes"
                  formValidation={formValidation}
                  isRequired={false}
                  title="More Details"
                />


            
            <div className="col-12">
              <div className="btn-container d-flex justify-content-center">
                {isLoading ? (
                  <button type="button" className="order-btn-2 px-5 ">
                    <i className="fas fa-spinner fa-spin px-2"></i>
                  </button>
                ) : (
                  <button
                    className="order-btn-2"
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
                    <i className="fa-solid fa-plus"></i>
                    <p className="cursor">Save Changes</p>
                  </button>
                )}
              </div>
            </div>

           
          </div>
        </div>
        {/* ------------ */}
      </form>
    </div>
  );
}
