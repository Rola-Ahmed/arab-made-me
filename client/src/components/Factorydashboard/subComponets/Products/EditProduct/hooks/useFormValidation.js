import { useFormik } from "formik";
import * as Yup from "yup";
import {
  requiredStringMax255,
  priceCurrency,
  textAreaValidate,
} from "utils/validationUtils";

export const useFormValidation = (productDetails, submitForm) => {
  let initialValues = {
    name: productDetails?.name || "",
    price: productDetails?.price || "",
    hsnCode: productDetails?.hsnCode || "",
    guarantee: productDetails?.guarantee || "",
    minOrderQuantity: productDetails?.minOrderQuantity || "",
    maxOrderQuantity: productDetails?.maxOrderQuantity || "",
    description: productDetails?.description || "",


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
  const validationSchema = Yup.object().shape({
    name: requiredStringMax255,

    price: priceCurrency,

    hsnCode: Yup.string()
      .min(6, "Minimum  length is 6")
      .max(15, "Maximum 15  is legnth"),
    guarantee: textAreaValidate(),
    minOrderQuantity: requiredStringMax255,
    maxOrderQuantity: requiredStringMax255,

    description: requiredStringMax255,

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

  return {
    formValidation,
    initialValues,
  };
};
