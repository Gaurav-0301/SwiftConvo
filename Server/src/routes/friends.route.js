const express = require('express');
const {
  searchUser,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendsList,
} = require('../controllers/friends.controller');
const { protectedRoute } = require('../middleware/auth.middleware');

const friendsRouter = express.Router();

friendsRouter.post('/searchUser', protectedRoute, searchUser);
friendsRouter.post('/sendRequest', protectedRoute, sendFriendRequest);
friendsRouter.get('/requests', protectedRoute, getFriendRequests);
friendsRouter.post('/accept/:id', protectedRoute, acceptFriendRequest);
friendsRouter.post('/reject/:id', protectedRoute, rejectFriendRequest);
friendsRouter.get('/list', protectedRoute, getFriendsList);

module.exports = friendsRouter;