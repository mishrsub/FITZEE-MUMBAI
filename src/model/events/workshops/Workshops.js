import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    timing:{
        type:Date,
        required:true
    },
    catalog:{
        type:String,
        enum:["paid","free","upcoming"]
    },
    image:{
        type:String,
        required:true
    },
    workshopDetailId:{
        type:mongoose.Types.ObjectId
    }
},{ timestamps:true });

export const WorkshopModel = new mongoose.model("Workshop",workshopSchema);

