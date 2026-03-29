const express=require("express");
const authRouter=express.Router();
const {protectedRoute}=require("../middleware/auth.middleware")
const {login,signup,logout,updateProfile, checkAuth} =require("../controllers/auth.controller")

authRouter.post("/login",login);
authRouter.post("/signup",signup )
authRouter.post("/logout",logout)
authRouter.put("/updateProfile",protectedRoute,updateProfile)
authRouter.get("/check",protectedRoute,checkAuth)
module.exports=authRouter;