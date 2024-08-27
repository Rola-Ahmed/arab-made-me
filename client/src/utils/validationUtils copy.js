import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  taxRegistrationNumber: Yup.string()
    .matches(/^[0-9]+$/, "Tax Registration Number should contain numbers only")
    .min(9, "Tax Registration Number minimum length is 9")
    .max(14, "Tax Registration Number maximum length is 14")
    .required("Tax Registration Number is required"),

  commercialRegistrationNumber: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "Commercial Registration Number should contain alphanumeric characters only")
    .min(8, "Commercial Registration Number minimum length is 8")
    .max(12, "Commercial Registration Number maximum length is 12")
    .required("Commercial Registration Number is required"),

  industrialLicenseNumber: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "Industrial License Number should contain alphanumeric characters only")
    .min(8, "Industrial License Number minimum length is 8")
    .max(16, "Industrial License Number maximum length is 16")
    .required("Industrial License Number is required"),

  industrialRegistrationNumber: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "Industrial Registration Number should contain alphanumeric characters only")
    .min(8, "Industrial Registration Number minimum length is 8")
    .max(16, "Industrial Registration Number maximum length is 16")
    .required("Industrial Registration Number is required"),

  businessRegistrationNumber: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "Business Registration Number should contain alphanumeric characters only")
    .min(8, "Business Registration Number minimum length is 8")
    .max(12, "Business Registration Number maximum length is 12")
    .required("Business Registration Number is required"),
});
