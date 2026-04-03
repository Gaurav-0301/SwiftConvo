const cloudinary  = require("cloudinary");
import { getReceiverSocketId, getReceiverSocketId } from './../lib/socket';
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

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await msg.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); 
   
    res.status(200).json(messages);

  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};





const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new msg({
      senderId,
      receiverId,
      text,
      image: imageUrl, 
    });

    await newMessage.save();

    const ReceiverSocketId=getReceiverSocketId(receiverId);
     if(ReceiverSocketId){
      io.to(ReceiverSocketId).emit("newMessage",newMessage);
     }
    res.status(201).json(newMessage);


  } catch (error) {
   
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports={getUsers, getMessages,sendMessage};