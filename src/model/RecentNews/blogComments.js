import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
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

const BlogComment = new mongoose.model("Blog-comment", commentSchema);

export default BlogComment;
