import { useFormik } from "formik";
import * as Yup from "yup";
import {
  requiredStringMax255,
  otherTextAreaValidate,
  textAreaValidate,
  requiredDateValidate,
} from "utils/validationUtils";
import { shippingConditionsArr } from "constants/shippingConditionsArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";
import { packingConditionsArr } from "constants/packingConditionsArr";

import { useEffect } from "react";

export const useFormValidation = (productDetails, submitForm) => {
  let initialValues = {
    quantity: productDetails?.quantity || "", //requried
    productName: productDetails?.productName || "", //requried

    // shippingConditions:productDetails?.shippingConditions ||  "", //optional,
    // shippingConditionsOther: productDetails?. || "",

    // packingConditions:productDetails?. ||  "", //optional
    // packingConditionsOther: productDetails?. || "",

    // qualityConditions:productDetails?. ||  "", //optional
    // qualityConditionsOther: productDetails?. || "",

    deadline: productDetails?.deadline || "", //optional
    country: productDetails?.preferredCountries || [], //

    productDescription: productDetails?.productDescription || "", //requried

    otherInfoRequest: productDetails?.otherInfoRequest || "", //optional

    // specialCharacteristicsArr:
    productCharacteristic:
      productDetails?.specialCharacteristics &&
      Object.keys(productDetails.specialCharacteristics).length != 0
        ? // [productDetails.specialCharacteristics]
          Object.entries(productDetails.specialCharacteristics).map(
            ([key, value], index) => ({
              keyword: key,
              value: value,
            })
          )
        : [
            {
              keyword: "",
              value: "",
            },
          ],
  };
  let validationSchema = Yup.object().shape({
    productName: requiredStringMax255,

    quantity: requiredStringMax255,

    shippingConditions: Yup.string(),
    shippingConditionsOther: otherTextAreaValidate(
      "shippingConditions",
      "other"
    ),

    packingConditions: Yup.string(),
    packingConditionsOther: otherTextAreaValidate("packingConditions", "other"),

    qualityConditions: Yup.string(),
    qualityConditionsOther: otherTextAreaValidate("qualityConditions", "other"),

    deadline: requiredDateValidate,

    otherInfoRequest: textAreaValidate(),

    productDescription: requiredStringMax255,

    country: Yup.array().of(Yup.string()).nullable(),

    productCharacteristic: Yup.array().of(
      Yup.object().shape({
        keyword: Yup.string().max(50, "max legnth is  50"),
        value: Yup.string().max(50, "max legnth is  50"),
      })
    ),
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

      initialValues = {
        ...initialValues,
        ...PackingCondVal, //packing conditions
        ...nameIfValueIsTrue, //qualityConditions
        ...ShippingCondVal, //shipping condition
      };

      formValidation.setValues(initialValues);
    }
  }, [productDetails]);

  return {
    formValidation,
    initialValues,
  };
};
