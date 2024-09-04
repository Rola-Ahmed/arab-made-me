import Joi from "joi"

const string = Joi.string();
const stringMin16 = Joi.string().min(16);
const stringMin6 = Joi.string().min(6);
const arrayString = Joi.array().items(Joi.string());
const number = Joi.number();
const bool = Joi.boolean(); 
const object = Joi.object();

export const addProductValidation = Joi.object({
    name: string.required(),
    description: stringMin16.required(),
    // coverImage: string,
    hsnCode: stringMin6.required(),
    // images: arrayString,
    price: number.required(),
    // available: bool,
    minOrderQuantity: number.required(),
    maxOrderQuantity: number,
    specialCharacteristics: object,
    guarantee: string,
    // averageRate: number,
    // factoryId: number,
    sectorId: number.required(),
    categoryId: number.required(),
    leadTime:string,
    country:string,
    city:string
});


export const updateProductValidation = Joi.object({
    id:number,
    name: string,
    description: stringMin16,
    // coverImage: string,
    hsnCode: stringMin6,
    // images: arrayString,
    price: number,
     available: bool,
    minOrderQuantity: number,
    maxOrderQuantity: number,
    specialCharacteristics: object,
    guarantee: string,
     averageRate: number,
    // factoryId: number,
    sectorId: number,
    categoryId: number,
    leadTime:string,
    country:string,
    city:string
});