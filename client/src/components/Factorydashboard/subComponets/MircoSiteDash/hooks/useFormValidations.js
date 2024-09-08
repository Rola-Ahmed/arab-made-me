import { useFormik } from "formik";
import * as Yup from "yup";
import {
  requiredStringMax255,
  phoneValidation,
  websiteValidation,
  RegisterationNumbers,
} from "utils/validationUtils";
import { useEffect } from "react";

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

    // factoryPhoneCode: factoryProfile?.phone
    //   ? factoryProfile?.phone?.slice(0, 3) ==
    //     countriesMiddleEast?.[0]?.phoneCode
    //     ? factoryProfile?.phone?.slice(0, 3)
    //     : factoryProfile?.phone?.slice(0, 4)
    //   : countriesMiddleEast?.[0]?.phoneCode,

    // factoryPhone: factoryProfile?.phone
    //   ? factoryProfile?.phone?.slice(0, 3) ==
    //     countriesMiddleEast?.[0]?.phoneCode
    //     ? factoryProfile?.phone?.slice(3)
    //     : factoryProfile?.phone?.slice(4)
    //   : countriesMiddleEast?.[0]?.phoneCode,


      factoryPhoneCode: (() => {
        const phoneCode = countriesMiddleEast?.[0]?.phoneCode;
        if (!factoryProfile?.phone) return phoneCode;
    
        const phonePrefix = factoryProfile?.phone.slice(0, 4);
        return phonePrefix.startsWith(phoneCode) 
          ? phonePrefix.slice(0, phoneCode.length) 
          : phonePrefix.slice(0, 3);
      })(),
    
      factoryPhone: (() => {
        const phoneCode = countriesMiddleEast?.[0]?.phoneCode;
        if (!factoryProfile?.phone) return "";
    
        const phonePrefix = factoryProfile?.phone.slice(0, 4);
        return phonePrefix.startsWith(phoneCode) 
          ? factoryProfile?.phone.slice(phoneCode.length) 
          : factoryProfile?.phone.slice(3);
      })(),
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
    whatsapp: factoryProfile?.socialLinks?.whatsapp || "",
    whatsappPhoneCode: factoryProfile?.socialLinks?.whatsapp || "",
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

  console.log(
    "factoryInfoValidation",
    factoryInfoValidation,
    factoryProfile?.phone
  );

  useEffect(() => {
    // if (factoryProfile) {
    countriesMiddleEast?.map((values) => {
      if (factoryProfile?.phone?.startsWith(values?.phoneCode)) {
        console.log(
          "yessssssss",
          values?.phoneCode,
          values?.phoneCode?.length,
          factoryProfile?.phone?.slice(0, values?.phoneCode?.length),
          factoryProfile?.phone?.slice(values?.phoneCode?.length)
        );

        factoryInfoValidation?.setValues((prev) => ({
          ...prev,
          factoryPhoneCode: factoryProfile?.phone?.slice(0, 5),
          factoryPhone: factoryProfile?.phone?.slice(5) || "",
        }));
      }
    });

    factoryInfoValidation?.setValues((prev) => ({
      ...prev,
      factoryPhoneCode: factoryProfile?.phone?.slice(0, 5),
      factoryPhone: factoryProfile?.phone?.slice(5) || "",
    }));
    // }
  }, [factoryProfile && factoryProfile?.phone, countriesMiddleEast]);

  useEffect(() => {
    if (factoryProfile && factoryProfile.phone) {
      const matched = countriesMiddleEast?.some((values) => {
        if (factoryProfile.phone.startsWith(values?.phoneCode)) {
          const phoneCodeLength = values.phoneCode.length;

          console.log(
            "Matched phone code:",
            values.phoneCode,
            "Sliced factoryPhoneCode:",
            factoryProfile.phone.slice(0, phoneCodeLength),
            "Sliced factoryPhone:",
            factoryProfile.phone.slice(phoneCodeLength)
          );

          // Set values in Formik
          factoryInfoValidation?.setValues((prev) => ({
            ...prev,
            factoryPhoneCode: factoryProfile.phone.slice(0, phoneCodeLength),
            factoryPhone: factoryProfile.phone.slice(phoneCodeLength) || "",
          }));

          // Stop iterating after match is found
          return true;
        }
        return false;
      });

      if (!matched) {
        console.log("No matching phone code found");
      }
    }
  }, [factoryProfile, countriesMiddleEast]);

  return {
    factoryInfoValidation,
    SocialAccountValidation,
    teamValidation,
    initialTeamValues,
    initialSocialAccount,
    initialFactoryInfoValidation,
  };
};
