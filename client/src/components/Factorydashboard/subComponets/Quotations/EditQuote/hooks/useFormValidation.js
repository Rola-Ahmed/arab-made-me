import { useFormik } from "formik";
import { useEffect } from "react";


import * as Yup from "yup";
import {
  requiredStringValidate,
  otherTextAreaValidate,
  requiredDateValidate,
  reqQualityValidate,
  textAreaValidate,
} from "utils/validationUtils";


const useFormValidation = (apiDetails,submitForm,qualityConditionsArr,paymentTypeArr,ShippingTypeSizeArr,packingConditionsArr) => {


  //-------------------------- initalization forms-----------------------------
  let initialValues = {
    price: apiDetails?.price || "",
    discounts: apiDetails?.discounts || 0,
    minQuantity: apiDetails?.minQuantity || "",
  
    notes: apiDetails?.notes || "",
    SupplyLocation:apiDetails?.supplyLocation,
    deadline:apiDetails?.deadline?.split('.')?.[0]||"",
    timeLine:apiDetails?.timeLine || [{date: "", quantity: ""}]
   
  };

  useEffect(() => {
    if (apiDetails && apiDetails?.length !== 0) {
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


// ----formik---------------------------------
// account info
  let formValidation = useFormik({
    initialValues,
    validationSchema,
    onSubmit: submitForm,
  });







  return {formValidation};
};

export default useFormValidation;
