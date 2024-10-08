
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export default asyncHandler;


 /*
const asyncHandler = (fn) => {
   return async (req,res,next) => {
        try {
            await fn(req,res,next);
        } catch (error) {
           console.log("Error : ",error);
           res.status(error.code || 500).json({
            success: false,
            message: error.message  
           })
           
        }
    }
}
*/
