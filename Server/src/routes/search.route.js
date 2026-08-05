const express=require('express');
const { searchUser } = require('../controllers/search.controller');
const searchRouter=express.Router();


searchRouter.post('/searchUser',searchUser);


module.exports=searchRouter;