import mongoose from "mongoose";

const contact = new mongoose.Schema({
    type:{
        type:String,
        enum:["contact","faq"],
    },
    name:{
        type:String,
        required:[true,"name should not be empty."],
        trim:true,
    },
    mobile:{
        type:String,
        required:[true,"mobile should not be empty."],
        trim:true,
        minLength:10,
        maxLength:10
    },
    email:{
        type:String,
        required:[true,"email should not be empty."],
        trim:true,
    },
    message:{
        type:String,
        required:[true,"purpose should not be empty."],
        trim:true,
    }
},
{
    timestamps:true
});

const ContactUs = new mongoose.model("Contact",contact);

export default ContactUs;