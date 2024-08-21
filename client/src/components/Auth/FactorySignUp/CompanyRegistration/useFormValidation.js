import { useFormik } from "formik";
import * as Yup from "yup";
let validationSchema = Yup.object().shape({
  factoryName: Yup.string()
    .max(50, "max length is 50")
    .required("Input field is Required"),
  factoryPhone: Yup.string()
    .matches(/^[0-9]+$/, "Input Field should contain numbers only")
    .min(6, "min length is 6")
    .max(15, "max length is 15")
    .required("Input field is Required"),
  WhatsappPhone: Yup.string()
    .matches(/^[0-9]+$/, "Input Field should contain numbers only")
    .min(6, "min length is 6")
    .max(15, "max length is 15")
    .required("Input field is Required"),
  website: Yup.string()
    .matches(
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63}([/?#]\S*)?$/,
      "Invalid URL"
    )
    .required("Input field is Required"),
  description: Yup.string()
    .required("Input Field is Required")
    .max(255, "max legnth is 255"),
  city: Yup.string().max(60, "max length is 60"),
  address: Yup.string().max(255, "max length is 255"),
});

export const useFormValidation = (countriesMiddleEast, submitForm) => {
  const formValidation = useFormik({
    initialValues: {
      factoryName: "",
      factoryPhone: "",
      factoryPhoneCode: countriesMiddleEast?.[0].phoneCode,

      WhatsappPhone: "",
      WhatsappPhoneCode: countriesMiddleEast?.[0].phoneCode,

      description: "",
      sectorId: "",
      website: "",
      country: countriesMiddleEast?.[0].code,
      city: "",
      address: "",
    },
    validationSchema: validationSchema,
    onSubmit: submitForm,
  });

  return formValidation;
};
