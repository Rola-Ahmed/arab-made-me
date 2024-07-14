import * as Yup from "yup";


// Utility to validate a conditional text area field
export const otherTextAreaValidate = (field, value) => {
  return Yup.string().when(field, {
    is: value,
    then: (schema) =>
      schema.required("Input field is Required").max(255, "max length is 255"),
  });
};


// Utility to validate a standard text area field textAreaValidate()
export const textAreaValidate = () =>
  Yup.string().max(255, "max legnth is 255");

// Utility to validate a required string field
export let requiredStringValidate = Yup.string().required(
  "Input field is Required"
);

// Utility to validate a date field that must be in the future
const now = new Date();
export const formattedDateValidate = new Date(
  now.getTime() + 24 * 60 * 60 * 1000
).toISOString()
  .slice(0, 16);
export const requiredDateValidate = Yup.date()
  .required("Input field is Required")
  .min(formattedDateValidate, "Invalid Date");

// --1----formattedDateValidate = tomorrow.toISOString().slice(0, 16);
//
// purpose: The function generates a formatted date string representing tomorrow's date and time. It ensures that the generated date is always in the future compared to the current date and time.
// Why is it needed?: This functionality is useful for scenarios where you want to enforce that the user selects a date and time in the future, preventing them from entering past or today's date.
export const passwordValidate = Yup.string()
  .required("Input Field is Required")
  .min(6, "min length is 6")
  .max(255, "max length is 255");

  export const reqQualityValidate = Yup.string()
  .required("Input field is Required")
  .matches(/^[0-9]+$/, "Input field must be numbers only")
  .min(1, "min 1 legnth");

