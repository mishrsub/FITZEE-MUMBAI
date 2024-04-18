import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    heading:{
      type: String,
      required: true,
    },
    description:[
      {
        title: {
          type: String,
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
      }
    ],
    status: {
      type: String,
      default: "enable",
      enum: ["enable", "disable"],
    },
  },
  { timestamps: true }
);

export const FaqModel = new mongoose.model("Faq", faqSchema);
