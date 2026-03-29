const jwt=require("jsonwebtoken")
const reg=require("../models/auth.model")

const protectedRoute=async(req,res,next)=>{
    try {
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:"Unauthorized-No Token Provided"
            });
        }
    
         const decoded=jwt.verify(token,process.env.JWT_SECRET);
         if(!decoded){
                return res.status(401).json({
                message:"Unauthorized-Invalid Token"
            });
         }

         const user=await reg.findById(decoded.id).select("-password");

         if(!user){
              return res.status(401).json({
                message:"User not found"
            });
         }
       
         req.user=user;

         next();
          
    } catch (error) {
        console.log("ProtectedRoute Error ",error);
        res.status(400).json({message:"MiddleWare ERROR"})
    }
}

module.exports={protectedRoute};