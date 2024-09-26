import { useFormik } from "formik";
import { shippingConditionsArr } from "constants/shippingConditionsArr";
import { packingConditionsArr } from "constants/packingConditionsArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";
import { paymentTypeArr } from "constants/paymentTypeArr";
import * as Yup from "yup";

import {
  requiredStringMax255,
  reqQualityValidate,
  otherTextAreaValidate,
  requiredStringValidate,
} from "utils/validationUtils";
import { useEffect } from "react";

export const useFormValidation = (productDetails, submitForm) => {
  let initialValues = {
    productName: productDetails?.productName || "",
    price: productDetails?.price || "",
    productHSNCode: productDetails?.productHSNCode || "",
    productDescription: productDetails?.productDescription || "",
    categoryId: productDetails?.categoryId || "",
    productId: productDetails?.productId || "", //optional
    preferredCountries: productDetails?.preferredCountries || [],
    quantity: productDetails?.quantity || [],
  };
  let validationSchema = Yup.object().shape({
    productName: requiredStringMax255,
    preferredCountries: Yup.array().of(Yup.string()).nullable(),

    price: reqQualityValidate,

    //   HSN (Harmonized System of Nomenclature) code field i
    productHSNCode: Yup.string()
      .min(6, "Minimum  length is 6")
      .max(15, "Maximum 15  is legnth"),

    quantity: reqQualityValidate,

    productDescription: requiredStringMax255,

    qualityConditions: requiredStringValidate,
    qualityConditionsOther: otherTextAreaValidate("qualityConditions", "other"),

    shippingConditions: requiredStringValidate,
    shippingConditionsOther: otherTextAreaValidate(
      "shippingConditions",
      "other"
    ),

    packingConditions: requiredStringValidate,
    packingConditionsOther: otherTextAreaValidate("packingConditions", "other"),

    paymentType: requiredStringValidate,
    paymentTypeOther: otherTextAreaValidate("paymentType", "other"),
  });

  let formValidation = useFormik({
    initialValues,

    validationSchema,
    // validate,
    onSubmit: submitForm,
  });

  useEffect(() => {
    if (productDetails && productDetails?.length != 0) {
      // quality

      // with us
      const matchingItem = qualityConditionsArr?.find(
        (item) => item.value === productDetails?.qualityConditions
      );
      // inital values
      let nameIfValueIsTrue = {
        qualityConditions: productDetails?.qualityConditions || "",
        qualityConditionsOther: "",
      };

      // case matchingItem is false then reset values
      if (!matchingItem) {
        nameIfValueIsTrue = {
          qualityConditions: "other",
          qualityConditionsOther: productDetails?.qualityConditions || "",
        };
      }

      // packing condition
      const initalPackingConditions = packingConditionsArr?.find(
        (item) => item.value === productDetails?.packingConditions
      );
      let PackingCondVal = {
        // if packging condition is null   || value is not selection on option "others"
        packingConditions: productDetails?.packingConditions || "",
        packingConditionsOther: "",
      };
      if (!initalPackingConditions) {
        // means that data is selected to option others
        PackingCondVal = {
          packingConditions: "other",
          packingConditionsOther: productDetails?.packingConditions || "",
        };
      }

      // with us
      // shippingConditions condition
      const initalShippingConditions = shippingConditionsArr?.find(
        (item) => item.value === productDetails?.shippingConditions
      );
      let ShippingCondVal = {
        // if packging condition is null   || value is not selection on option "others"
        shippingConditions: productDetails?.shippingConditions || "",
        shippingConditionsOther: "",
      };
      if (!initalShippingConditions) {
        // means that data is selected to option others
        ShippingCondVal = {
          shippingConditions: "other",
          shippingConditionsOther: productDetails?.shippingConditions || "",
        };
      }

      // check if payment value is set to a option "value" || or option others
      // if option others: then set paymentType value to "other" && set paymentTypeOther to the paymentType value that is coming from the database
      const initalPaymentType = paymentTypeArr?.find(
        (item) => item.value === productDetails?.paymentType
      );
      let paymentVal = {
        // if packging condition is null   || value is not selection on option "others"
        paymentType: productDetails?.paymentType || "",
        paymentTypeOther: "",
      };
      if (!initalPaymentType) {
        // means that data is selected to option others
        paymentVal = {
          paymentType: "other",
          paymentTypeOther: productDetails?.paymentTerms || "",
        };
      }

      initialValues = {
        ...initialValues,
        ...PackingCondVal, //packing conditions
        ...nameIfValueIsTrue, //qualityConditions
        ...ShippingCondVal, //shipping condition
        ...paymentVal, //payment
      };

      formValidation.setValues(initialValues);
    }
  }, [productDetails]);

  console.log("formValidation", formValidation);
  return {
    formValidation,
    initialValues,
  };
};
