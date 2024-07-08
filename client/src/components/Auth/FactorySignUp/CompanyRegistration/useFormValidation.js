import { useFormik } from "formik";
import * as Yup from "yup";
let validationSchema = Yup.object().shape({
  factoryName: Yup.string()
    .max(50, "max length is 50")
    .required("Input field is Required"),
  factoryPhone: Yup.string()
    .matches(/^[0-9]+$/, "Input Field should contain numbers only")
    .min(6, "min length is 6")
    .max(15, "max length is 15"),
  WhatsappPhone: Yup.string()
    .matches(/^[0-9]+$/, "Input Field should contain numbers only")
    .min(6, "min length is 6")
    .max(15, "max length is 15"),
  website: Yup.string().matches(
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63}([/?#]\S*)?$/,
    "Invalid URL"
  ),
  description: Yup.string()
    .required("Input Field is Required")
    .max(255, "max legnth is 255"),
  city: Yup.string().min(3, "min length is 3").max(60, "max length is 60"),
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
    },
    validationSchema: validationSchema,
    onSubmit: submitForm,
  });

  return formValidation;
};
