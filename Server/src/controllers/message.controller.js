const cloudinary  = require("cloudinary");
const reg=require("../models/auth.model");
const msg = require("../models/message.model");

const getUsers=async(req,res)=>{
try {
  const loggedInUserId=req.user._id;
  const filteredUsers=await reg.find({_id:{$ne:loggedInUserId}}).select("-password");
 res.status(200).json({
    message:"filtereduser",
    data:filteredUsers
});
} catch (error) {
    console.log("Error in getUser Controller",error);
    res.status(500).json({
        message:"Error in getUser Controller"
    });
}
}

const getMessages=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params;
        const myId=req.user._id;
        const messages=await MessageChannel.find({
            $or:[
                {senderId:myId, receiverId:userTochatId},
                {senderId:userTochatId, receiverId:myId}
            ],
        })
    } catch (error) {
        console.log("getmessages controller error ",error);
        res.status(500).json({
            message:"getmessages controller error"
        })
    }
}

const sendMessage=async(req,res)=>{
try {
    const{image,text}=req.body;
    const {id:receiverId}=req.params;
    const senderId=req.user._id;

    let imageUrl;
    if(image){
        const uploadResponse=cloudinary.uploader.upload(image);
        imageUrl=uploadResponse.secure_url;
    }
     
    const newMessage=new msg({
        senderId,
        receiverId,
        text,
        image:imageUrl
    });
    await newMessage.save()


    //realtime functionality goes here=> socket.io

    res.status(201).json({newMessage});

} catch (error) {
    console.log("sendMessage controller Error ",error);
    res.status(500).json({
        message:"sendMessage controller Error"
    })
}
}

module.exports={getUsers, getMessages,sendMessage};