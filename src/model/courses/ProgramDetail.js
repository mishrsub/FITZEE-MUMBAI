import mongoose from "mongoose";

const programDetailSchema = new mongoose.Schema({
  // Reference to Programs
  programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
  subProgramId: { type: mongoose.Schema.Types.ObjectId },
  programDetailImg: [
    {
      type: String,
      required: [true,"Program detail image is required"],
      trim: true,
    },
  ],
  programBrief: {
    type: String,
    required: [true,"Program brief is required"],
    trim: true,
  },
  programDescription: {
    type: String,
    required: [true,"Program description is required"],
    trim: true,
  },
  programStatus: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  programPoint:[
    {
        title:{
            type: String,
            required: true,
            trim: true,
        },
        description:{
            type: String,
            required: true,
            trim: true,
        }
    }
  ],
  syllabusCovered:{
    type: String,
    required: [true,"syllabusCovered field is required."],
    trim: true,
  },
  subjectTaught:[
    {
      type:String,
      required:[true,"subject is required."],
      trim: true,
    }
  ],
  goals:[
    {
      type:String,
      required:[true,"goals is required"]
    }
  ],
  programSummary:{
    phases:{
      type:Number
    },
    duration:{
      type:String
    },
    numOfHrs:{
      type:String
    },
    ratingOfCourse:{
      type:Number
    }
  },
  batchStartDate:{
    date:{
      type:Date
    },
    day:{
      type:String
    },
    center:{
      type:String
    },
    batch:{
      type:String
    }
  },
  keyword:[
    {
      keywordName:String,
      fullForm:String
    }
  ]
});

export const ProgramDetail = new mongoose.model(
  "ProgramDetail",
  programDetailSchema
);
