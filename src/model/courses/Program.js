import mongoose from "mongoose";
import { SubprogramSchema } from "./SubProgram.js";

const ProgramSchema = new mongoose.Schema({
    name: { type: String, required: [true,"class is required."],trim:true,lowercase: true },
    classId:{ type: mongoose.Types.ObjectId,ref:"Class" },
    subprograms: [SubprogramSchema],
    isDeleted:{
        type:Boolean,
        default:false
    }
});

const ProgramModel = mongoose.model('Program', ProgramSchema);

export { ProgramModel }