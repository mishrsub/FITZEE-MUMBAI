import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
     name: { type: String, required: true },

},{timestamps:true});

const GroupModel = mongoose.model('Group', groupSchema);

export { GroupModel }