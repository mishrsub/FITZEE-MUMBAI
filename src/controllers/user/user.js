import { ErrHandle } from "../../utils/ErrorHandler.js";
import Users from "../../model/user/user.js";
import { EnquiryModel } from "../../model/user/userEnquiry.js";
import { generateOtp } from "../../utils/generateOtp.js";

class User {
  register = async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        throw new ErrHandle(406, "Empty field should not be acceptable");
      }

      const user = await Users.findOne({ email });

      if (user) {
        throw new ErrHandle(400, "User already registered.");
      }

      const saveUser = await Users.create({
        username,
        email,
        password,
      });

      const token = await saveUser.generateToken();

      return res.status(200).json({ status: 200, user: saveUser, token });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: 400, message: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ErrHandle(406, "Empty field should not be acceptable.");
      }

      const user = await Users.findOne({ email }).select("+password");

      if (!user) {
        throw new ErrHandle(400, "User not registered.");
      }

      const checkPass = await user.comparePassword(password);

      if (!checkPass) {
        throw new ErrHandle(406, "Login Failed -- check your id and password.");
      }

      const token = await user.generateToken();

      return res.status(200).json({ status: 200, user, token });
    } catch (error) {
      return res.status(400).json({ status: 400, message: error.message });
    }
  };

  enquiry = async (req, res) => {
    try {
      const { phone } = req.body;
      const otp = generateOtp();
      const otpExpiry = Date.now() + 2 * 60 * 1000;

      // Validation
      if (!phone) {
        return res
          .status(400)
          .json({ status: 400, message: "Phone number is required." });
      }

      const userPhone = await EnquiryModel.findOne({ phone });

      if (userPhone) {
        //send otp
        userPhone.otp = otp;
        userPhone.otpExpiry = otpExpiry;
        userPhone.isVerified = false;
        await userPhone.save();

        return res
          .status(200)
          .json({ status: 200, message: "Otp sended!", otp: userPhone.otp });
      }

      const userData = await EnquiryModel.create({ phone, otp, otpExpiry });
      return res
        .status(200)
        .json({ status: 200, message: "Otp sended!", otp: userData.otp });
    } catch (error) {
      return res.status(400).json({ status: 400, message: error.message });
    }
  };

 enquiryVerify = async (req, res) => {
    try {
      const { phone, otp } = req.body;
  
      // Validation
      if (!phone || !otp) {
        throw new ErrHandle(400, "Phone number and OTP are required.");
      }
  
      const phoneData = await EnquiryModel.findOne({
        phone,
        otp,
        otpExpiry: { $gt: Date.now() },
      });
  
      if (!phoneData) {
        throw new ErrHandle(400, "OTP expired or invalid.");
      }
  
      // Your logic for successful OTP verification goes here
      phoneData.otp=undefined;
      phoneData.otpExpiry=undefined;
      phoneData.isVerified = true;
      await phoneData.save();

      res.status(200).json({ status: 200, message: "OTP verified successfully." });
    } catch (error) {
      console.error("Error in enquiryVerify API:", error);
  
      if (error instanceof ErrHandle) {
        return res.status(error.statusCode).json({ status: error.statusCode, message: error.message });
      }
  
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  };
  
  enquiryDetail = async (req, res) => {
    try {
        const { _id,firstName,lastName,email,className,studyCenter} = req.body;

        const checkPhone = await EnquiryModel.findOne({ _id,isVerified:true });

        if(!checkPhone) {
            throw new ErrHandle(404,"Data not found");
        }

        const userDetail = await EnquiryModel.findByIdAndUpdate(_id,{ 
            $set:{
                firstName,lastName,email,className,studyCenter
            }
        },{ new:true });

        return res.status(200).json({ status:200,message:"Enquiry added successfull."});
    } catch (error) {
        if (error instanceof ErrHandle) {
            return res.status(error.statusCode).json({ status: error.statusCode, message: error.message });
          }
      
          res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  };

  getAllEnquiry = async(req,res) =>{
    try {
        const getEnquiries = await EnquiryModel.find({}).sort({createdAt: -1}).select({
            firstName:1,
            lastName:1,
            email:1,       
            studyCenter:1,
            className:1,
            phone:1
        });

        return res.status(200).json({status:200,enquiries:getEnquiries});
    } catch (error) {
        if (error instanceof ErrHandle) {
            return res.status(error.statusCode).json({ status: error.statusCode, message: error.message });
          }
      
          res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  }
}

const user = new User();
export { user };
