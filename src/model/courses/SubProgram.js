import mongoose from "mongoose";

export const SubprogramSchema = new mongoose.Schema({
    name: { type: String,  trim: true, lowercase: true },
    programDetailId: { type: mongoose.Types.ObjectId, ref: "ProgramDetail" },
    programImg: { type: String },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    review: [
        {
            name: {
                type: String,
            },
            email: {
                type: String,
            },
            phone: {
                type: String,
            },
            programName: {
                type: String,

                trim: true,
            },
            message: {
                type: String,
                trim: true,
            },
            rating: {
                type: Number,
            },
        },
    ],
    averageRating: {
        type: Number,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
});
