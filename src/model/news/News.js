import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    commentId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Blog-comment",
      },
    ],
    image: {
      type: String,
      // required: true,
      trim: true,
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    likes: [{
        ip: String,
      }],
    author:{
        type:String,
        required:true
    }
},{ timestamps:true });

newsSchema.methods.toggleLike = async function (ip) {
    const existingLikeIndex = this.likes.findIndex(like => like.ip === ip);
  
    if (existingLikeIndex === -1) {
      // IP not found, add a new like
      this.likes.push({ ip });
    } else {
      // IP found, remove the existing like (toggle)
      this.likes.splice(existingLikeIndex, 1);
    }
  
    await this.save();
    return this;
  };

export const NewsModel = new mongoose.model("News",newsSchema);

