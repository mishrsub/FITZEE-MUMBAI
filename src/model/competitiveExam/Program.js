import mongoose from "mongoose";

const ProgramSchema = new mongoose.Schema({
    classId:{
        type:mongoose.Types.ObjectId,
        ref:"Class"
    },
    image:{
        type:String,
        required:true,
    },
    heading:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    organisingBody:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    eligibleClass:[
        {
            type:String,
            required:true
        }
    ],
    about:{
        type:String,
        required:true,
    },
    like:{
        type:Number,
        default:0
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
});

const ProgramModel = mongoose.model('Program-competitive', ProgramSchema);

export { ProgramModel }