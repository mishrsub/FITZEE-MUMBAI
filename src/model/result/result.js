import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
    },
});

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // You can add more properties for subjects as needed
});

const passingYearSchema = new mongoose.Schema({
    year: {
        type: String,
        trim:true
    },
    image: {
        type: [String]
    }, // Array of image filenames,
});

const resultSchema = new mongoose.Schema({
    programImg:{
        type: String,
        required: true,
        trim:true
    },
    programName: {
        type: String,
        required: true,
        trim:true
    },
    eligibleClass: [classSchema],
    subjectsCovered: [subjectSchema],
    date: {
        type: Date,
        required: true,
    },
    passingYears: [passingYearSchema],
    status:{
        type:Boolean,
        default:false
    }
});

export const ResultModel = mongoose.model("Result", resultSchema);
