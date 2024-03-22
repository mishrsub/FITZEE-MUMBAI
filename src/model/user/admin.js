import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { ErrHandle } from "../../utils/ErrorHandler.js";

const adminSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        trim:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        select:false
    },
    token:{
        type:String,
        trim:true
    },
    tokenExpiry:{
        type:Date
    }

},
{
    timestamps:true
});


adminSchema.pre("save",async function(next) {
    if(!this.isModified("password")) {
        next();
    }
    try {
        const hashPass = await bcryptjs.hash(this.password,10);
        this.password = hashPass;
        next();
    } catch (error) {
        return next(error);
    }
})

adminSchema.methods.generateToken = async function() {
    try {
        return jwt.sign({
            userId:this._id,
            email:this.email,
            date: Date.now()/1000
        },process.env.SECRET_KEY,{
            expiresIn:"1d"
        });
    } catch (error) {
        console.log(error);
    }
}

adminSchema.methods.comparePassword = async function(password) {
    try {
        const pass = await bcryptjs.compare(password,this.password);

        if(!pass) {
            throw new ErrHandle(406,"Login Failed -- check your id and password.");
        }

        return pass;
    } catch (error) {
        console.log(error);
    }
}

const Admin = new mongoose.model("Admin",adminSchema);

export default Admin;
