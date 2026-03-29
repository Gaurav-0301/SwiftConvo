const mongoose=require("mongoose");

const messageSchema=mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reg",
        required:true,
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reg",
        required:true
    },
    text:{
        type:String,

    },
    image:{
        type:String
    }
},
{timestamps:true}
);

const msg=mongoose.model("msg",messageSchema);
module.exports=msg;