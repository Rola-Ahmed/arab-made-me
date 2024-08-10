import { useFormik } from "formik";
import * as Yup from "yup";


const useFormValidation = (onSubmitCallback,ImporterProfile) => {


  // valirable validations   // update data
  let emailValidation = Yup.string()
  .email("Invalid email")
  .required("Input Field is Required")
  .min(5, "min length is 5")
  .max(255, "max length is 255");

let nameValidation = Yup.string()
  .required("Input Field is Required")
  .max(25, "max length is 25");
let phoneValidation = Yup.string()
  .required("Input Field is Required")
  // .matches(/^[0-9]+$/, "Input Field should contain numbers only")
  .min(6, "min length is 6")
  .max(15, "max length is 15");

  let urlValidate=Yup.string().matches(
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63}([/?#]\S*)?$/,
    "Invalid URL"
  )

  //-------------------------- initalization forms-----------------------------
 let  initalAccInfo={
    repFullName: ImporterProfile?.repName || "",
    repEmail: ImporterProfile?.repEmail || "",
    repPhone: ImporterProfile?.repPhone || "",
    name: ImporterProfile?.name || "",
  }
let initalSocialAcc  ={
  instgramLink: ImporterProfile?.socialLinks?.instgram || "",
        facebookLink: ImporterProfile?.socialLinks?.facebook || "",
        website: ImporterProfile?.website || "",
}
  
let initalImporterInfo= {
  city: ImporterProfile?.city || "",
        country: ImporterProfile?.country || "",

        commercialRegisterationNumber:
          ImporterProfile?.commercialRegisterationNumber || "",

        address: ImporterProfile?.address?.[0] || "",

        description: ImporterProfile?.description || "",
        exportingCountries: ImporterProfile?.exportingCountries,
        sectorId: ImporterProfile?.[0]?.id || "",
}

// ----formik---------------------------------
// account info
  let AccountInfoValidation = useFormik({
    initialValues: initalAccInfo,
    validationSchema: Yup.object().shape({
      repFullName: nameValidation,
      name: nameValidation,
      repEmail: emailValidation,
      repPhone: phoneValidation,
    }),
    onSubmit: onSubmitCallback,
  });


  // socail links
  let SocialAccountValidation = useFormik({
    initialValues: initalSocialAcc,
    validationSchema: Yup.object().shape({
      website: urlValidate,
      instgramLink: urlValidate,
      facebookLink: urlValidate,
    }),
    onSubmit: onSubmitCallback,
  });






  let ImporterInfoValidation = useFormik({
    initialValues: initalImporterInfo,
    validationSchema: Yup.object().shape({
      city: Yup.string().max(60, "max length is 60"),

      commercialRegisterationNumber: Yup.string()
        .matches(/^[0-9]+$/, "Input Field should contain numbers only")
        .min(8, "min length is 8")
        .max(16, "max length is 16"),

      address: Yup.string()
        .required("Input Field is Required")
        .max(255, "max length is 255"),

      description: Yup.string()
        .required("Input Field is Required")
        .max(255, "max length is 255"),
      exportingCountries: Yup.array().of(Yup.string()).nullable(),
    }),
    onSubmit: onSubmitCallback,
  });



  return {initalAccInfo,AccountInfoValidation,initalSocialAcc,SocialAccountValidation,ImporterInfoValidation,initalImporterInfo};
};

export default useFormValidation;
