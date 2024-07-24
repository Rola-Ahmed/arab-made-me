import jwt from "jsonwebtoken"
import { User } from "../database/models/user.model.js"
import { asyncHandler } from "../utils/error_handling.js"

export const checkUserToken = asyncHandler(
    async (req, res, nxt) => {
        const { authorization } = req.headers
        if(!authorization) return res.json({message:"Signin first"})

        const decoded = jwt.verify(authorization, process.env.SECRET_KEY)

        const user = await User.findByPk(decoded.id)
        if (!user) return nxt(new Error("invalid token", { status: 401 }))

        if(user.logout==true || user.emailActivated==false) {
            //user.updatedAt.getTime() /1000 > decoded.iat ||
           // console.log(user.updatedAt.getTime()/1000 > decoded.iat);
            return res.status(401).json({message:"invalid token, please login again or activate your email"})}

        req.user = user
        nxt()
    }
)