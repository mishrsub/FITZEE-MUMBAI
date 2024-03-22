import mongoose from "mongoose";

const UserEnquirySchema = new mongoose.Schema({
    phone:{
        type:String,
        required:true,
        minLength:10,
        trim:true,
        unique:true
    },
    otp:{
        type:String,
        trim:true,
        minLength:6,
        maxLength:6
    },
    otpExpiry:{
        type:Date
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    firstName:{
        type:String,
        trim:true,
    },
    lastName:{
        type:String,
        trim:true,
    },
    email:{
        type:String,
        trim:true,
    },
    className:{
        type:Number,
    },
    studyCenter:{
        type:String,
        trim:true,
    }
},{timestamps:true})

export const EnquiryModel = new mongoose.model("EnquiryModel",UserEnquirySchema);
