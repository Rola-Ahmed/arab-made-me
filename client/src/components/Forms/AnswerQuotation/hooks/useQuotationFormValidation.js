import { useFormik } from "formik";
import * as Yup from "yup";
import {
  requiredStringValidate,
  otherTextAreaValidate,
  requiredDateValidate,
  reqQualityValidate,
  textAreaValidate,
  requiredStringMax255
} from "utils/validationUtils";

const useQuotationFormValidation = (
  initialValuesOverride = {},
  onSubmitCallback
) => {
  let validationSchema = Yup.object().shape({
    // from cilent
    // requestedquantity: requiredStringMax255,
    // avialabe qunaitiy for user
    minquantity: textAreaValidate,
    // minquantity: requiredStringMax255,

    price: reqQualityValidate,

    discounts: Yup.string()
      .matches(/^[0-9]+$/, "Input field must be numbers only")
      .min(1, "min 1 legnth"),

    packingConditions: Yup.string(),
    packingConditionsOther: otherTextAreaValidate("packingConditions", "other"),

    paymentType: Yup.string(),
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
    // requestedQuantity: "1", //requried
    minQuantity: "", //requried
    price: "", //requried
    discounts: "", //optional

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

  return formValidation;
};

export default useQuotationFormValidation;
