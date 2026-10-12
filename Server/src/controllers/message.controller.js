const cloudinary = require("cloudinary").v2;
const { getReceiverSocketId, io } = require("./../lib/socket");
const reg = require("../models/auth.model");
const msg = require("../models/message.model");
const friends = require("../models/friends.model");

const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find all accepted friendships involving the logged-in user
    const friendships = await friends
      .find({
        $or: [
          { requesterId: loggedInUserId, status: "accepted" },
          { receiverId: loggedInUserId, status: "accepted" },
        ],
      })
      .populate("requesterId", "-password")
      .populate("receiverId", "-password");

    const friendUsers = friendships
      .map((f) => {
        if (!f.requesterId || !f.receiverId) return null;
        const isRequester = f.requesterId._id.toString() === loggedInUserId.toString();
        return isRequester ? f.receiverId : f.requesterId;
      })
      .filter(Boolean);

    res.status(200).json({
      message: "friends list",
      data: friendUsers,
    });
  } catch (error) {
    console.error("Error in getUser Controller:", error);
    res.status(500).json({
      message: "Error in getUser Controller: " + error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await msg
      .find({
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      })
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
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

    const ReceiverSocketId = getReceiverSocketId(receiverId);
    if (ReceiverSocketId) {
      io.to(ReceiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUsers, getMessages, sendMessage };