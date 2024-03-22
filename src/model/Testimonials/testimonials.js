import mongoose from "mongoose";

const testimonials = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    rank:{
        type:String,
        trim:true,
        default:""
    },
    className:{
        type:String,
        trim:true
    },
    program:{
        type:String,
        trim:true
    },
    image:{
        type:String,
        // required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
});

const Testimonial = new mongoose.model("Testimonial",testimonials);

export default Testimonial;