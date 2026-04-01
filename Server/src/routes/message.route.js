const express=require("express");
const { protectedRoute } = require("../middleware/auth.middleware");
const { getUsers, getMessages,sendMessage } = require("../controllers/message.controller");
const messageRouter=express.Router();


messageRouter.get("/getusers",protectedRoute,getUsers);
messageRouter.get("/getmessages/:id",protectedRoute, getMessages);
messageRouter.post("/sendmessage/:id",protectedRoute, sendMessage);

module.exports=messageRouter;