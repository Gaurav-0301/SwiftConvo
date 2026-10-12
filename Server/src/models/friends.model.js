const mongoose = require('mongoose');

const friendsSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reg',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reg',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

friendsSchema.index({ requesterId: 1, receiverId: 1 });

const friends = mongoose.models.friends || mongoose.model('friends', friendsSchema);

module.exports = friends;
