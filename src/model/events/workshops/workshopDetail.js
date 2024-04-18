import mongoose from "mongoose";

const workshopDetailSchema = new mongoose.Schema(
  {
    workshopId: {
      type: mongoose.Types.ObjectId,
      ref: "Workshop",
    },
    subTitle: [
      {
        title: {
          type: String,
          required: true,
        },
        description: [
          {
            type: String,
            required: true,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const WorkshopDetailModel = new mongoose.model(
  "Workshop-detail",
  workshopDetailSchema
);
