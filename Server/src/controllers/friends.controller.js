const reg = require('../models/auth.model');
const friends = require('../models/friends.model');
const { getReceiverSocketId, io } = require('../lib/socket');

const searchUser = async (req, res) => {
  const { uid } = req.body;
  const currentUserId = req.user._id;

  try {
    if (!uid || !uid.trim()) {
      return res.status(400).json({
        success: false,
        message: "UID is required",
      });
    }

    const targetUser = await reg.findOne({ uid: uid.trim() }).select("-password");
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "No user found with this UID",
      });
    }

    const isSelf = targetUser._id.toString() === currentUserId.toString();

    let relationshipStatus = "none";
    let requestId = null;

    if (!isSelf) {
      const existingRelation = await friends.findOne({
        $or: [
          { requesterId: currentUserId, receiverId: targetUser._id },
          { requesterId: targetUser._id, receiverId: currentUserId },
        ],
      });

      if (existingRelation) {
        requestId = existingRelation._id;
        if (existingRelation.status === "accepted") {
          relationshipStatus = "friends";
        } else if (existingRelation.status === "pending") {
          relationshipStatus =
            existingRelation.requesterId.toString() === currentUserId.toString()
              ? "request_sent"
              : "request_received";
        }
      }
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        profilePic: targetUser.profilePic,
        uid: targetUser.uid,
      },
      isSelf,
      relationshipStatus,
      requestId,
    });
  } catch (error) {
    console.error("Search failed:", error);
    return res.status(500).json({
      success: false,
      message: "Search failed: " + error.message,
    });
  }
};

const sendFriendRequest = async (req, res) => {
  const requesterId = req.user._id;
  const { receiverId } = req.body;

  try {
    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID or UID is required",
      });
    }

    // Support either MongoDB ObjectId or UID
    let targetUser = null;
    if (receiverId.match(/^[0-9a-fA-F]{24}$/)) {
      targetUser = await reg.findById(receiverId);
    }
    if (!targetUser) {
      targetUser = await reg.findOne({ uid: receiverId });
    }

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      });
    }

    const targetUserId = targetUser._id;

    if (requesterId.toString() === targetUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a friend request to yourself",
      });
    }

    let existingRelation = await friends.findOne({
      $or: [
        { requesterId, receiverId: targetUserId },
        { requesterId: targetUserId, receiverId: requesterId },
      ],
    });

    if (existingRelation) {
      if (existingRelation.status === "accepted") {
        return res.status(400).json({
          success: false,
          message: "You are already friends with this user",
        });
      }

      if (existingRelation.status === "pending") {
        if (existingRelation.requesterId.toString() === requesterId.toString()) {
          return res.status(400).json({
            success: false,
            message: "Friend request is already pending",
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "This user has already sent you a request. Check your incoming requests!",
          });
        }
      }

      // If previously rejected, allow re-requesting
      if (existingRelation.status === "rejected") {
        existingRelation.requesterId = requesterId;
        existingRelation.receiverId = targetUserId;
        existingRelation.status = "pending";
        await existingRelation.save();

        // Emit socket notification
        const receiverSocketId = getReceiverSocketId(targetUserId.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newFriendRequest", {
            _id: existingRelation._id,
            name: req.user.name,
            profilePic: req.user.profilePic,
            uid: req.user.uid,
            requesterId: req.user._id,
          });
        }

        return res.status(200).json({
          success: true,
          message: "Friend request sent successfully",
          request: existingRelation,
        });
      }
    }

    const newRequest = await friends.create({
      requesterId,
      receiverId: targetUserId,
      status: "pending",
    });

    // Real-time socket notification to receiver if online
    const receiverSocketId = getReceiverSocketId(targetUserId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newFriendRequest", {
        _id: newRequest._id,
        name: req.user.name,
        profilePic: req.user.profilePic,
        uid: req.user.uid,
        requesterId: req.user._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Friend request sent successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Send friend request error:", error);
    return res.status(500).json({
      success: false,
      message: "Sending friend request failed: " + error.message,
    });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const requests = await friends
      .find({ receiverId: currentUserId, status: "pending" })
      .populate("requesterId", "name profilePic uid _id")
      .sort({ createdAt: -1 });

    const formattedRequests = requests
      .filter((r) => r.requesterId)
      .map((r) => ({
        _id: r._id,
        name: r.requesterId.name,
        profilePic: r.requesterId.profilePic,
        uid: r.requesterId.uid,
        requesterId: r.requesterId._id,
        createdAt: r.createdAt,
      }));

    return res.status(200).json({
      success: true,
      requests: formattedRequests,
    });
  } catch (error) {
    console.error("Get friend requests error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get friend requests",
    });
  }
};

const acceptFriendRequest = async (req, res) => {
  const { id: requestId } = req.params;
  const currentUserId = req.user._id;

  try {
    const request = await friends.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    if (request.receiverId.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to accept this request",
      });
    }

    request.status = "accepted";
    await request.save();

    // Socket notification to requester if online
    const requesterSocketId = getReceiverSocketId(request.requesterId.toString());
    if (requesterSocketId) {
      io.to(requesterSocketId).emit("friendRequestAccepted", {
        requestId: request._id,
        friend: {
          _id: req.user._id,
          name: req.user.name,
          profilePic: req.user.profilePic,
          uid: req.user.uid,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Friend request accepted",
      request,
    });
  } catch (error) {
    console.error("Accept friend request error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to accept friend request",
    });
  }
};

const rejectFriendRequest = async (req, res) => {
  const { id: requestId } = req.params;
  const currentUserId = req.user._id;

  try {
    const request = await friends.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    if (request.receiverId.toString() !== currentUserId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to decline this request",
      });
    }

    request.status = "rejected";
    await request.save();

    return res.status(200).json({
      success: true,
      message: "Friend request declined",
    });
  } catch (error) {
    console.error("Decline friend request error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to decline friend request",
    });
  }
};

const getFriendsList = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const friendships = await friends
      .find({
        $or: [{ requesterId: currentUserId }, { receiverId: currentUserId }],
        status: "accepted",
      })
      .populate("requesterId", "name profilePic uid _id")
      .populate("receiverId", "name profilePic uid _id");

    const friendsList = friendships
      .map((f) => {
        if (!f.requesterId || !f.receiverId) return null;
        const isRequester = f.requesterId._id.toString() === currentUserId.toString();
        const friend = isRequester ? f.receiverId : f.requesterId;
        return {
          _id: friend._id,
          name: friend.name,
          profilePic: friend.profilePic,
          uid: friend.uid,
          friendshipId: f._id,
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      friends: friendsList,
    });
  } catch (error) {
    console.error("Get friends list error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get friends list",
    });
  }
};

module.exports = {
  searchUser,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendsList,
};