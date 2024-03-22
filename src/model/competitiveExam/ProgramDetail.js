import mongoose from "mongoose";

const programDetailSchema = new mongoose.Schema({
  // Reference to Programs
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program-competitive",
  },
  programDetailImg: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  programBrief: {
    type: String,
    required: true,
    trim: true,
  },
  programDescription: {
    type: String,
    required: true,
    trim: true,
  },
  programStatus: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  subjects: [
    {
      type: String,
      required: true,
    },
  ],
  programPoint: [
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
});

export const ProgramDetail = new mongoose.model(
  "Competitive-program-detail",
  programDetailSchema
);
