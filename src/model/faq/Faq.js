import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "enable",
      enum: ["enable", "disable"],
    },
  },
  { timestamps: true }
);

export const FaqModel = new mongoose.model("Faq", faqSchema);
