import mongoose from "mongoose";

const eventMenuSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    subMenus: [
        {
            title: {
                type: String,
                required: true,
            },
            link: {
                type: String,
                required: true,
            },
            // isDelete: {
            //     type: Boolean,
            //     default: false,
            // },
        },
    ],
    // isDelete: {
    //     type: Boolean,
    //     default: false,
    // },
});

export const EventMenu = mongoose.model("EventMenu", eventMenuSchema);
