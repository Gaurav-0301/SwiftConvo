const reg=require('../models/auth.model');


const searchUser=async(req,res)=>{
    const{uid}=req.body;

try {
    console.log(req.body);
    if(!uid){
        return res.status(400).json({
            success:false,
            message:"uid required !!", 
        })
    }
    const searchRes=await reg.findOne({uid});
    if(!searchRes){
        return res.status(400).json({
            success:false,
            message:"user with this uid not exist!!", 
        })
    }
        res.status(200).json({
            success:true,
            user:{
                _id:searchRes._id,
                name:searchRes.name,
                profilePic:searchRes.profilePic,
                uid:searchRes.uid,
            } 
        });
    }
 catch (error) {
    res.status(500).json({
        success:false,
        message:"Search failed "+error
    });
    console.log("Search failed "+error);
}
}

module.exports={searchUser};