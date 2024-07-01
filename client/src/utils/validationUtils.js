import * as Yup from "yup";

export const otherTextAreaValidate = (field, value) => {
  return Yup.string().when(field, {
    is: value,
    then: (schema) =>
      schema.required("Input field is Required").max(255, "max length is 255"),
  });
};

export const textAreaValidate = () => {
  return Yup.string().max(255, "max legnth is 255");
};

export let requiredStringValidate = Yup.string().required(
  "Input field is Required"
);

// export const validationSchema = Yup.object().shape({
//   email: Yup.string()
//     .email("Invalid email")
//     .required("Input Field is Required")
//     .min(5, "min length is 5")
//     .max(255, "max length is 255"),
//   password: Yup.string()
//     .required("Input Field is Required")
//     .min(6, "min length is 6")
//     .max(255, "max length is 255"),
// });

const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);
export const formattedDateValidate = tomorrow.toISOString().slice(0, 16);
