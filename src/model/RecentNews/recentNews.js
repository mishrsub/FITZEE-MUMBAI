import mongoose from "mongoose";

const recentNews = new mongoose.Schema(
  {
    commentId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Blog-comment",
      },
    ],
    image: {
      type: String,
      required: true,
      trim: true,
    },
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const RecentNews = new mongoose.model("RecentNew", recentNews);

export default RecentNews;
