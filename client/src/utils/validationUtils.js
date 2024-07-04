import * as Yup from "yup";

export const otherTextAreaValidate = (field, value) => {
  return Yup.string().when(field, {
    is: value,
    then: (schema) =>
      schema.required("Input field is Required").max(255, "max length is 255"),
  });
};
// export const otherTextAreaValidate = (field, value) =>
//   Yup.string().when(field, {
//     is: value,
//     then: Yup.string()
//       .required("Input field is Required")
//       .max(255, "max length is 255"),
//   });

// textAreaValidate()
export const textAreaValidate = () =>
  Yup.string().max(255, "max legnth is 255");

// requiredStringValidate
export let requiredStringValidate = Yup.string().required(
  "Input field is Required"
);
// const now = new Date();
// const tomorrow = new Date(now);
// tomorrow.setDate(now.getDate() + 1);
// export const formattedDateValidate = tomorrow.toISOString().slice(0, 16);

// Date setup to not accept the old date or todays date
// must accept future date
const now = new Date();
export const formattedDateValidate = new Date(
  now.getTime() + 24 * 60 * 60 * 1000
)
  .toISOString()
  .slice(0, 16);

export const requiredDateValidate = Yup.date()
  .required("Input field is Required")
  .min(formattedDateValidate, "Invalid Date");

// --1----formattedDateValidate = tomorrow.toISOString().slice(0, 16);
//
// purpose: The function generates a formatted date string representing tomorrow's date and time. It ensures that the generated date is always in the future compared to the current date and time.
// Why is it needed?: This functionality is useful for scenarios where you want to enforce that the user selects a date and time in the future, preventing them from entering past or today's date.
