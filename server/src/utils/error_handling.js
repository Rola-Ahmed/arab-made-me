export const asyncHandler=(fn)=>{
    return (req, res, nxt) => {
        fn(req, res, nxt).catch(
            (error) => {
                return nxt(new Error(error.message, { status: 500 }))
            }
        )
    }
}


export const globalErrorHandler=(error,req,res,nxt)=>{
    return res.status(error.status || 500).json({
        message:"error",
        errorMessage:error.message,
        trace:error.stack
    })
}