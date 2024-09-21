import { useFormik } from "formik";
import * as Yup from "yup";
import useCountries from "hooks/useCountries";

const useFormValidation = (submitAccInfo, factoryProfile) => {
  // valirable validations   // update data
  const countriesMiddleEast = useCountries();
  let emailValidation = Yup.string()
    .email("Invalid email")
    .required("Input Field is Required")
    .max(255, "max length is 255");

  let nameValidation = Yup.string()
    .required("Input Field is Required")
    .max(25, "max length is 25");
  let phoneValidation = Yup.string()
    .required("Input Field is Required")
    // .matches(/^[0-9]+$/, "Input Field should contain numbers only")
    .min(6, "min length is 6")
    .max(15, "max length is 15");

  //-------------------------- initalization forms-----------------------------
  let initialAccountInfo = {
    repFirstName: factoryProfile?.repName?.[0] || "",
    repLastName: factoryProfile?.repName?.[1] || "",

    repEmail: factoryProfile?.repEmail || "",

    repPhoneCode:
      factoryProfile?.repPhone?.slice(0, 4) ||
      countriesMiddleEast?.[0]?.phoneCode,
    repPhone: factoryProfile?.repPhone?.slice(4) || "",
    // realPhone:factoryProfile?.repPhone
  };

  // ----formik---------------------------------
  // account info
  let AccountInfoValidation = useFormik({
    initialValues: initialAccountInfo,
    validationSchema: Yup.object().shape({
      repFirstName: nameValidation,
      repLastName: nameValidation,
      repEmail: emailValidation,
      repPhone: phoneValidation,
    }),
    onSubmit: submitAccInfo,
  });

  return {
    initialAccountInfo,
    AccountInfoValidation,
  };
};

export default useFormValidation;
