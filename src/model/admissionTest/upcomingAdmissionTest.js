import mongoose from "mongoose";

const admissionTest = new mongoose.Schema({
    examName:{
        type:String,
        trim:true,
        required:true
    },
    examDate:{
        type:Date,
        required:true
    },
    urlName:{
        type:String,
        required:true
    },
    eligibleClass:[
        {
            className: { type: String, required: true }
        }
    ],
    isDeleted:{
        type:Boolean,
        default:false
    },
    enable:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
});

const AdmissionTest = new mongoose.model("AdmissionTest",admissionTest);

export default AdmissionTest;