const express=require("express");
const authRouter=express.Router();
const {potectedRoute}=require("../middleware/auth.middleware")
const {login,signup,logout,updateProfile, checkAuth} =require("../controllers/auth.controller")

authRouter.post("/login",login);
authRouter.post("/signup",signup )
authRouter.post("/logout",logout)
authRouter.put("/updateProfile",potectedRoute,updateProfile)
authRouter.get("/check",potectedRoute,checkAuth)
module.exports=authRouter;