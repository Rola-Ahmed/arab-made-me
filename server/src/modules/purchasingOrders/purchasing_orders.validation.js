import Joi from"joi";


const factoryId = Joi.number().integer();
const repName = Joi.string();
const contactData = Joi.object();
const productId = Joi.number().integer();
const quantity = Joi.number().integer().min(1);
const status = Joi.string();
const instructions = Joi.string();
const shippingConditions = Joi.string();
const packingConditions = Joi.string();
const legalStamp = Joi.string();
const paymentTerms = Joi.string();
const conditionsOfDelays = Joi.string();
const estimationDelay = Joi.string();
const timeOfManufacturingDelay = Joi.string();
const examinationDelay = Joi.string();
const companyQualityTesting = Joi.string();
const sourcingOfferId=Joi.number()
const timeLine=Joi.array().max(5).items(Joi.object({
  date:Joi.date(),
  quantity:Joi.number()
})).required()
const quotationId=Joi.number()



export const addPurchasingOrderValidationSchemaProduct = Joi.object({
  productName:Joi.string().required(),
    factoryId: factoryId.required(),
    repName: repName.required(),
    contactData: contactData.required(),
    quantity: quantity.required(),
    instructions,
    shippingConditions,
    packingConditions,
    legalStamp,
    paymentTerms,
    conditionsOfDelays,
    estimationDelay,
    timeOfManufacturingDelay,
    examinationDelay,
    companyQualityTesting,
    timeLine:timeLine.required(),
    // quotationId,
    // sourcingOfferId,
    productId:productId.required(),
  });


  export const addPurchasingOrderValidationSchemaSourcingOffer = Joi.object({
    productName:Joi.string().required(),
      factoryId: factoryId.required(),
      repName: repName.required(),
      contactData: contactData.required(),
      quantity: quantity.required(),
      instructions,
      shippingConditions,
      packingConditions,
      legalStamp,
      paymentTerms,
      conditionsOfDelays,
      estimationDelay,
      timeOfManufacturingDelay,
      examinationDelay,
      companyQualityTesting,
      timeLine:timeLine.required(),

      sourcingOfferId:sourcingOfferId.required(),
    });

    export const addPurchasingOrderValidationSchemaQuotation= Joi.object({
      productName:Joi.string().required(),
        factoryId: factoryId.required(),
        repName: repName.required(),
        contactData: contactData.required(),
        quantity: quantity.required(),
        instructions,
        shippingConditions,
        packingConditions,
        legalStamp,
        paymentTerms,
        conditionsOfDelays,
        estimationDelay,
        timeOfManufacturingDelay,
        examinationDelay,
        companyQualityTesting,
        timeLine:timeLine.required(),

        quotationId:quotationId.required(),
      });

  export const updatePurchasingOrderValidationSchema=Joi.object({
    productName:Joi.string(),
    // factoryId,
    id:Joi.number().required(),
    repName,
    contactData,
    // productId,
    quantity,
    status,
    instructions,
    shippingConditions,
    packingConditions,
    legalStamp,
    paymentTerms,
    conditionsOfDelays,
    estimationDelay,
    timeOfManufacturingDelay,
    examinationDelay,
    companyQualityTesting,
    timeLine,
    status:Joi.string()
  }).required()


  export const getPOsValidation=Joi.object({
    include:Joi.string().valid("factory","sourcingOffer","importer","quotation","product")
})