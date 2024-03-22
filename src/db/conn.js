import mongoose from "mongoose";

export const connectDB = async() =>{
    try {
       const URI = process.env.DB_URI;
       const conn = await mongoose.connect(URI);

       if(conn) {
        console.log(`Db connected successfully.........`);
       }
    } catch (error) {
        throw new Error(error.message);
    }
}
