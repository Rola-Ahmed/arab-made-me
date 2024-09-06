import { useFormik } from "formik";
import * as Yup from "yup";
import {
  requiredStringMax255,
  phoneValidation,
  websiteValidation,
  RegisterationNumbers,
} from "utils/validationUtils";

export const useFormValidations = (
  factoryProfile,
  countriesMiddleEast,
  HandleUpdateFactoryInfo,
  handleUpdateSocialAccounts,
  submitTeam
) => {
  const initialFactoryInfoValidation = {
    //---------------------- Factory Info
    factoryName: factoryProfile?.name || "",
    yearOfEstablishmint: factoryProfile?.yearOfEstablishmint || "",
    city: factoryProfile?.city || "",
    country: factoryProfile?.country || countriesMiddleEast?.[0].code,
    yearlySalesIncome: factoryProfile?.yearlySalesIncome || "",

    // YearlyIncome:factoryProfile?.YearlyIncome ||"",
    // phone number
    numberOfEmployees: factoryProfile?.numberOfEmployees || "", //select optiton
    taxRegisterationNumber: factoryProfile?.taxRegisterationNumber || "",
    commercialRegisterationNumber:
      factoryProfile?.commercialRegisterationNumber || "",

    IndustrialLicenseNumber: factoryProfile?.IndustrialLicenseNumber || "",
    IndustrialRegistrationNumber:
      factoryProfile?.IndustrialRegistrationNumber || "",
    BusinessRegistrationNumber:
      factoryProfile?.BusinessRegistrationNumber || "",

    address: factoryProfile?.address?.[0] || "",
    description: factoryProfile?.description || "",
    whyUs: factoryProfile?.whyUs || "",

    factoryPhoneCode:
      factoryProfile?.phone?.slice(0, 3) || countriesMiddleEast?.[0]?.phoneCode,
    factoryPhone: factoryProfile?.phone?.slice(3) || "",
    importingCountries: factoryProfile?.importingCountries || [],
  };

  let factoryInfoValidation = useFormik({
    initialValues: initialFactoryInfoValidation,
    validationSchema: Yup.object().shape({
      factoryName: requiredStringMax255,
      yearOfEstablishmint: Yup.string()
        .required("Input Field is Required")
        .matches(/^[0-9]+$/, "Input Field should contain numbers only")
        .min(4, "min length is 4")
        .max(4, "max length is 4"),

      taxRegisterationNumber: RegisterationNumbers([
        Yup.ref("commercialRegisterationNumber"),
        Yup.ref("IndustrialRegistrationNumber"),
        Yup.ref("IndustrialLicenseNumber"),
        Yup.ref("BusinessRegistrationNumber"),
      ]),

      commercialRegisterationNumber: RegisterationNumbers([
        Yup.ref("taxRegisterationNumber"),
        Yup.ref("IndustrialRegistrationNumber"),
        Yup.ref("IndustrialLicenseNumber"),
        Yup.ref("BusinessRegistrationNumber"),
      ]),
      IndustrialRegistrationNumber: RegisterationNumbers([
        Yup.ref("taxRegisterationNumber"),
        Yup.ref("commercialRegisterationNumber"),
        Yup.ref("IndustrialLicenseNumber"),
        Yup.ref("BusinessRegistrationNumber"),
      ]),
      IndustrialLicenseNumber: RegisterationNumbers([
        Yup.ref("taxRegisterationNumber"),
        Yup.ref("commercialRegisterationNumber"),
        Yup.ref("IndustrialRegistrationNumber"),
        Yup.ref("BusinessRegistrationNumber"),
      ]),
      BusinessRegistrationNumber: RegisterationNumbers([
        Yup.ref("taxRegisterationNumber"),
        Yup.ref("commercialRegisterationNumber"),
        Yup.ref("IndustrialRegistrationNumber"),
        Yup.ref("IndustrialLicenseNumber"),
      ]),

      address: requiredStringMax255,

      description: requiredStringMax255,
      whyUs: requiredStringMax255,
      factoryPhone: phoneValidation,
      importingCountries: Yup.array().of(Yup.string()).nullable(),
    }),
    onSubmit: HandleUpdateFactoryInfo,
  });

  const initialSocialAccount = {
    // social links
    instagramLink: factoryProfile?.socialLinks?.instagram || "",
    facebookLink: factoryProfile?.socialLinks?.facebook || "",
    website: factoryProfile?.website || "",
    whatsapp: factoryProfile?.whatsapp || "",
  };
  let SocialAccountValidation = useFormik({
    initialValues: initialSocialAccount,
    validationSchema: Yup.object().shape({
      website: websiteValidation,
      instagramLink: websiteValidation,
      facebookLink: websiteValidation,
    }),
    onSubmit: handleUpdateSocialAccounts,
  });

  const initialTeamValues = {
    //---------------------- Factory Info
    teamName: "",
    teamRole: "",
  };
  let teamValidation = useFormik({
    initialValues: initialTeamValues,
    validationSchema: Yup.object().shape({
      teamName: requiredStringMax255,
      teamRole: requiredStringMax255,
    }),
    onSubmit: submitTeam,
  });

  return {
    factoryInfoValidation,
    SocialAccountValidation,
    teamValidation,
    initialTeamValues,
    initialSocialAccount,
    initialFactoryInfoValidation,
  };
};
