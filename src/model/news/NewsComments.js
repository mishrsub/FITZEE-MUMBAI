import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required:true,
      trim:true
    },
    email:{
      type: String,
      required:true,
      trim:true
    },
    phone:{
      type: String,
      required:true,
      trim:true
    },
    description: {
      type: String,
      required:true,
      trim:true
    },
    like: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const NewsComment = new mongoose.model("News-comment", newsSchema);

export default NewsComment;
