import { User } from "../../database/models/user.model.js";
import { sendMail } from "../../utils/email.js";
import { asyncHandler } from "../../utils/error_handling.js";
import jwt, { decode } from "jsonwebtoken"
import bcrypt from "bcrypt"
// import Trim from "trim";
import { Op } from "sequelize";
import { crudOps } from "../../utils/crud_ops.js";
import { checkLoginTimes } from "../login_times/login_times.js";

export const signup = asyncHandler(
    async (req, res, nxt) => {
        const {  email, password,  } = req.body
        const userExisit=await User.findOne({where:{email}})
        if(userExisit) return res.json({message:"email already exisits"})
        // let name = [Trim(firstName), Trim(lastName)]
        const user = await User.create({ email, password,emailActivated:true })
        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.SECRET_KEY, { expiresIn: "10 m" })
        const newToken = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.SECRET_KEY)
        console.log(req.hostname);
        await sendMail({
            to: email,
            subject: "Activation Email From Arab-Made",
            html: `
                <a href="${req.protocol}://${req.hostname}/emailActivation?action=${token}">Confirm Accaount</a>
                <br>
                <br>
                `,
                // <a href="${req.protocol}://${req.headers.host}/api/v1/users/newConfirmEmail/${newToken}">resend confirmation mail</a>
        })
        return user ? res.status(201).json({ message: "done", user,token:newToken }) : nxt(new Error("email exisits", { status: 409 }))
    }
)

export const signin = asyncHandler(
    async (req, res, nxt) => {
        const { email, password } = req.body
        const userExisit = await User.findOne({ where: { email } })
        if (!userExisit) return res.status(400).json({ message: "wrong email or password" })

        if(! await checkLoginTimes(userExisit.id)) return res.status(429).json({message:"try again later"})
      
        const rightPassword = bcrypt.compareSync(password, userExisit.password)
        if (!rightPassword) return res.status(400).json({ message: "wrong email or password" })

        if(!userExisit.emailActivated){
            const token=jwt.sign({id:userExisit.id,email:userExisit.email},process.env.SECRET_KEY,{expiresIn:"5 m"})
            await sendMail({
                to:userExisit.email,
                subject:"Arab-Made Activation Email",
                html:`<a href="${req.protocol}://${req.hostname}/emailActivation/${token}">Confirm Accaount</a>`
            })
            return res.status(403).json({"message":"email is not activated yet, check your inbox to activate your email"})
        }

        

        if(userExisit.logout==true) {
         await userExisit.update({logout:false})
         await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log(process.env.SECRET_KEY);
        const token = jwt.sign({
            id: userExisit.id,
            email: userExisit.email
        }, process.env.SECRET_KEY)
        console.log("here");
        console.log(userExisit.logout);
        console.log(userExisit.updatedAt.getTime()/1000 >jwt.verify(token,process.env.SECRET_KEY).iat);
        return res.status(200).json({ message: "done", user: userExisit, token })
    }
)


export const getUsers = crudOps.getAll(User)

// export const getImporters = asyncHandler(
//     async (req, res, nxt) => {
//         const importers = await User.findAll(({where:{role:{[Op.or]: ['importer', 'both']}}}))
//         return res.status(200).json({ message: "done", importers })
//     }
// )
// export const getFactories = asyncHandler(
//     async (req, res, nxt) => {
//         const factories = await User.findAll({where:{role:{[Op.or]: ['factory', 'both']}}})
//         return res.status(200).json({ message: "done", factories })
//     }
// )

export const updateUser = asyncHandler(
    async (req, res, nxt) => {
        if(req.user.email!="akramswilam@outlook.com" && req.body.role=='admin')  return res.json({message:"you are not allowed to be an admin"})
        if(req.emailActivated) return res.json({message:"can't update email activation"})
        if(req.body.email) return res.json({message:"email can't be updated"})

        if(req.body.password && !req.body.oldPassword) return res.json({message:"send old password"})

        if(req.body.password && req.body.oldPassword){
            const rightPassword = bcrypt.compareSync(req.body.oldPassword, req.user.password)
        if (!rightPassword) return res.status(402).json({ message: "wrong password" })
         await req.user.update({logout:true})
        }

        const updatedUser = Object.assign({}, req.user, req.body)
        await req.user.update(updatedUser)
        return res.status(202).json({ message: "updated", updatedUser })
    }
)

export const confirmEmail = crudOps.confirmEmail(User,'user')

export const resendConfirmationMail = crudOps.resendConfirmationMail(User,'user','emailActivation=','email')

export const deleteUserFromProfile=crudOps.deleteFromReq('user')

export const deleteUserFromAdmin=crudOps.deleteModel(User)

export const getUserData=crudOps.getOne(User)

export const forgetPassword=asyncHandler(
    async(req,res,nxt)=>{
        const{email}=req.body
        const user=await User.findOne({where:{email}})
        if(!user) return res.json({message:"invalid email"})
        
        const token=jwt.sign({id:user.id, email:user.email},process.env.SECRET_KEY,{expiresIn:"5 m"})
        await sendMail({
            to: user.email,
            subject: "Reset your password",
            html: `<a href="${req.protocol}://${req.hostname}/user/reset-password/change"> Reset Your Password </a>`,
            //`<a href="${req.protocol}://${req.headers.host}/api/v1/users/resetPassword/${token}">Reset Password</a>`
        })
        return res.status(200).json({message:"check your email",token})
    }
)
export const resetPassword=asyncHandler(
    async(req,res,nxt)=>{
        const { token } = req.params
        if(!token) return res.json({message:"please send token"})

        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        const user = await User.findByPk(decoded.id)
        if (!user) return nxt(new Error("invalid token", { status: 400 }))

        const {password}= req.body
        if(password.length<6)   return res.json({message:"password must be atleast 6 characters"})
        await user.update({password})
        return res.status(200).json({message:"done",user})
    }
)

export const logoutUser=asyncHandler(
    async(req,res,nxt)=>{
        await req.user.update({logout:true})
        return res.status(200).json({message:"done"})
    }
)

export const createAdmin=asyncHandler(
    async(req,res,nxt)=>{
        const { firstName, lastName, email, password, phone } = req.body
        const userExisit=await User.findOne({where:{email}})
        if(userExisit) return res.json({message:"email already exisits"})
        let name = [firstName,' ', lastName]
        const user = await User.create({ email, password, name, phone,role:'admin',emailActivated:true })
        return res.status(201).json({message:"done",user})
    }
)


export const cleanUnActive=asyncHandler(
    async(req,res,nxt)=>{
        await User.destroy({
            where: {
              emailActivated: false,
              activeTimeLimit: {
                [Op.lte]: new Date()
              }
            }
          })
          return res.status(200).json({message:"done"})
    }
)

export const updateFromAdmin=crudOps.updateModel(User)