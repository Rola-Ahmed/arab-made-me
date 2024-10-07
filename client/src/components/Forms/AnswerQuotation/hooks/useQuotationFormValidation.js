import { useFormik } from "formik";
import * as Yup from "yup";
import {
  requiredStringValidate,
  otherTextAreaValidate,
  requiredDateValidate,
  priceCurrency,
  textAreaValidate,
  requiredStringMax255,
} from "utils/validationUtils";

const useQuotationFormValidation = (
  initialValuesOverride = {},
  onSubmitCallback
) => {
  let validationSchema = Yup.object().shape({
    // from cilent
    // avialabe qunaitiy for user
    minQuantity: Yup.string().required(),
    quantity: Yup.string().required(),

    price: priceCurrency,

    discounts: Yup.string()
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),

    packingConditions: Yup.string().required("Input field is Required"),
    packingConditionsOther: otherTextAreaValidate("packingConditions", "other"),

    paymentType: Yup.string().required("Input field is Required"),
    paymentTypeOther: otherTextAreaValidate("paymentType", "other"),

    qualityConditions: Yup.string().required("Input field is Required"),
    qualityConditionsOther: otherTextAreaValidate("qualityConditions", "other"),

    ShippingTypeSize: requiredStringValidate,

    ShippingTypeSizeOther: otherTextAreaValidate("ShippingTypeSize", "other"),
    SupplyLocation: requiredStringValidate,

    shippingConditions: requiredStringValidate,
    shippingConditionsOther: otherTextAreaValidate(
      "shippingConditions",
      "other"
    ),

    deadline: requiredDateValidate,

    timeLine: Yup.array()
      .of(
        Yup.object().shape({
          date: requiredDateValidate,
          quantity: requiredStringMax255,
        })
      )
      .min("1", "minimum length is 1"),

    notes: textAreaValidate(),
  });

  const defaultInitialValues = {
    minQuantity: "", //requried
    price: "", //requried
    discounts: "", //optional
    quantity:"",
    SupplyLocation:"",
    shippingConditions: "", //required,
    shippingConditionsOther: "",
    packingConditions: "", //req
    paymentType: "", //req
    qualityConditions: "", //req
    country: "", //
    productDescription: "", //requried
    notes: "", //optional

    // productName: productName || "", //requried

    // Send only one of those ids:
    // specialManufacturingRequestId: specialManufacturingRequestId || "",
    // privateLabelingId: "",
    // whiteLabelingId: "",
    // sourcingRequestId: sourcingRequestId || "",
    // quotationRequestId: quotationRequestId || "",
    // productName: productName || "",
    // importerId: importerId || "",

    qualityConditionsOther: "",
    packingConditionsOther: "",
    paymentTypeOther: "",
    deadline: "",
    ShippingTypeSize: "",
    ShippingTypeSizeOther: "",
    timeLine: [
      {
        date: "",
        quantity: "",
      },
    ],
  };

  const initialValues = { ...defaultInitialValues, ...initialValuesOverride };

  const formValidation = useFormik({
    initialValues,
    validationSchema,
    onSubmit: onSubmitCallback,
  });

  console.log("formValidation", formValidation);

  return formValidation;
};

export default useQuotationFormValidation;
