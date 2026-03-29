const express=require("express");
const authRouter=express.Router();

const {login,signup,logout} =require("../controllers/auth.controller")

authRouter.post("/login",login);
authRouter.post("/signup",signup )
authRouter.post("/logout",logout)

module.exports=authRouter;