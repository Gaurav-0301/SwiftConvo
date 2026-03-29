const mongoose = require("mongoose");


const authSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },
    profilePic:{
        type:String,
        default:"",
    }
}, { timestamps: true });





// Create model
const Reg = mongoose.model("Reg", authSchema);

module.exports = Reg;