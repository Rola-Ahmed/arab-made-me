import { asyncHandler } from "../utils/error_handling.js"

export const checkMediaLength =(req,model,propertiesLength)=>{
    for (const property in propertiesLength) {
        console.log(req[`${model}`]["dataValues"][`${property}`].length);
        console.log(req.files );
        if (req[`${model}`]["dataValues"][`${property}`].length + req.files[`${property}`].length > propertiesLength[`${property}`]){
            return false
        }
    }
    return true
}