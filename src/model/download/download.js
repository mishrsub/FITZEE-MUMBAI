import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
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
            pdfFile: {
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

export const Menu = mongoose.model("Download", menuSchema);
