import { useFormik } from "formik";
import * as Yup from "yup";
import {
  requiredStringMax255,
  reqQualityValidate,
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

    categoryId: productDetails?.categoryId || "",
    sectorId: productDetails?.sectorId || "",

    // specialCharacteristicsArr:
    //   productDetails?.specialCharacteristics &&
    //   Object.keys(productDetails.specialCharacteristics).length !== 0
    //     ? // [productDetails.specialCharacteristics]
    //       Object.entries(productDetails.specialCharacteristics).map(
    //         ([key, value], index) => ({
    //           specialCharKeyWord: key,
    //           specialCharDesc: value,
    //         })
    //       )
    //     : [],


        productCharacteristic: [
          {
            keyword: "",
            value: "",
          },
        ],
  };
  const validationSchema = Yup.object().shape({
    name: requiredStringMax255,

    price: reqQualityValidate,

    hsnCode: Yup.string()
      .required("Input Field is Required")
      .min(6, "Minimum  length is 6")
      .max(15, "Maximum 15  is legnth"),
    guarantee: textAreaValidate(),
    minOrderQuantity: reqQualityValidate,
    maxOrderQuantity: reqQualityValidate,
    categoryId: Yup.string().required("Input Field is Required"),
    // sectorId: Yup.string().required("Input Field is Required"),

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
