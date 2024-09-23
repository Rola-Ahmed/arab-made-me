import { useFormik } from "formik";
import * as Yup from "yup";

import {
  RegisterationNumbers,
  requiredStringMax255,
  emailValidation,
} from "utils/validationUtils";

const useFormValidation = (
  submitAccInfo,
  onSubmitSocial,
  onSubmitfactoryInfo,
  ImporterProfile
) => {
  let phoneValidation = Yup.string()
    .required("Input Field is Required")
    // .matches(/^[0-9]+$/, "Input Field should contain numbers only")
    .min(6, "min length is 6")
    .max(15, "max length is 15");

  let urlValidate = Yup.string().matches(
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,63}([/?#]\S*)?$/,
    "Invalid URL"
  );

  //-------------------------- initalization forms-----------------------------
  let initalAccInfo = {
    repFullName: ImporterProfile?.repName || "",
    repEmail: ImporterProfile?.repEmail || "",
    repPhone: ImporterProfile?.repPhone || "",
    name: ImporterProfile?.name || "",

    // commercialRegisterationNumber: ImporterProfile?.commercialRegisterationNumber || "",
    // vatNumber: ImporterProfile?.vatNumber || "",
    // importerLicenseNumber:ImporterProfile?.importerLicenseNumber || "",
  };
  let initalSocialAcc = {
    instgramLink: ImporterProfile?.socialLinks?.instagram || "",
    facebookLink: ImporterProfile?.socialLinks?.facebook || "",
    whatsapp: ImporterProfile?.socialLinks?.whatsapp || "",
    website: ImporterProfile?.website || "",
  };

  let initalImporterInfo = {
    city: ImporterProfile?.city || "",
    country: ImporterProfile?.country || "",

    address: ImporterProfile?.address?.[0] || "",

    description: ImporterProfile?.description || "",
    exportingCountries: ImporterProfile?.exportingCountries,
    sectorId: ImporterProfile?.[0]?.id || "",

    commercialRegisterationNumber:
      ImporterProfile?.commercialRegisterationNumber || "",
    vatNumber: ImporterProfile?.vatNumber || "",
    importerLicenseNumber: ImporterProfile?.importerLicenseNumber || "",
  };

  // ----formik---------------------------------
  // account info
  let AccountInfoValidation = useFormik({
    initialValues: initalAccInfo,
    validationSchema: Yup.object().shape({
      repFullName: requiredStringMax255,
      name: requiredStringMax255,
      repEmail: emailValidation,
      repPhone: phoneValidation,
    }),
    onSubmit: submitAccInfo,
  });

  // socail links
  let SocialAccountValidation = useFormik({
    initialValues: initalSocialAcc,
    validationSchema: Yup.object().shape({
      website: urlValidate,
      instgramLink: urlValidate,
      facebookLink: urlValidate,
      whatsapp: phoneValidation,
    }),
    onSubmit: onSubmitSocial,
  });

  let ImporterInfoValidation = useFormik({
    initialValues: initalImporterInfo,
    validationSchema: Yup.object().shape({
      city: Yup.string().max(60, "max length is 60"),

      commercialRegisterationNumber: RegisterationNumbers([
        Yup.ref("vatNumber"),
        Yup.ref("importerLicenseNumber"),
      ]),
      vatNumber: RegisterationNumbers([
        Yup.ref("importerLicenseNumber"),
        Yup.ref("commercialRegisterationNumber"),
      ]),
      importerLicenseNumber: RegisterationNumbers([
        Yup.ref("vatNumber"),
        Yup.ref("commercialRegisterationNumber"),
      ]),

      address: Yup.string()
        .required("Input Field is Required")
        .max(255, "max length is 255"),

      description: Yup.string()
        .required("Input Field is Required")
        .max(255, "max length is 255"),
      exportingCountries: Yup.array().of(Yup.string()).nullable(),
    }),
    onSubmit: onSubmitfactoryInfo,
  });

  // console.log("AccountInfoValidation", AccountInfoValidation);
  return {
    initalAccInfo,
    AccountInfoValidation,
    initalSocialAcc,
    SocialAccountValidation,
    ImporterInfoValidation,
    initalImporterInfo,
  };
};

export default useFormValidation;
