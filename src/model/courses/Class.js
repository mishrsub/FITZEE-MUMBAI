import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
     name: { type: String, required: true },
     programs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Program' }],
     isDeleted:{ 
          type:Boolean,
          default:false
     },
     type:{
          type:String,
          enum:["programs","competitive"]
     },
     groupId:{
          type:mongoose.Types.ObjectId
     }
},{timestamps:true});

const ClassModel = mongoose.model('Class', classSchema);

export { ClassModel }