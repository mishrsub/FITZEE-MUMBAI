import { ErrHandle } from "../../utils/ErrorHandler.js";
import AdminModel from "../../model/user/admin.js";
import crypto from "crypto";
import { sendingMail } from "../../utils/sendMail.js";

const register = async () => {
  try {
    const adminCredential = {
      email: "admin@admin.com",
      password: "shiva@com",
    };

    const user = await AdminModel.findOne({ email: adminCredential.email });

    if (user) {
      console.log(`Exist!`);
      return;
    }

    const adminData = new AdminModel(adminCredential);
    await adminData.save();

    return true;
  } catch (error) {
    console.log(error);
  }
};
register();
class Admin {
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ErrHandle(406, "Empty field should not be acceptable.");
      }

      const user = await AdminModel.findOne({ email }).select("+password");

      if (!user) {
        throw new ErrHandle(400, "User not found.");
      }

      const checkPass = await user.comparePassword(password);

      if (!checkPass) {
        throw new ErrHandle(406, "Login Failed -- check your id and password.");
      }

      const token = await user.generateToken();

      // Set the token in cookies
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000, // Expires in 1 days (adjust as needed)
        secure: true, // Set to true in production
        sameSite: "strict", // Set the sameSite attribute as needed
      });

      return res.status(200).json({ status: 200, user, token });
    } catch (error) {
      return res.status(400).json({ status: 400, message: error.message });
    }
  };

  forgotVerifyPage = async (req, res) => {
    try {
        const { token } = req.params;

        // Validate and verify the token
        // You should have logic here to verify the token's validity and expiry
    
        // If token is valid, render the change password form with the token
        res.render('change-password', { token })
    } catch (error) {
      return res.status(400).json({ status: 400, message: error.message });
    }
  };

  forgotRequest = async (req, res) => {
    try {
      const { email } = req.body;

      const user = await AdminModel.findOne({ email });

      if (!user) throw new ErrHandle(404, "User not found");

      // Generate random bytes of length 16 (128 bits)
      const randomBytes = crypto.randomBytes(8).toString("hex");
      const expiryTime = Date.now() + 5 * 60 * 1000;
      const URL = `http://localhost:8000/api/admin/forget/verify/${randomBytes}`;
      user.token = randomBytes;
      user.tokenExpiry = expiryTime;
      await user.save();

      await sendingMail(user, "FORGOT_PASS", URL);

      return res
        .status(200)
        .json({ status: 200, message: "Check your email to verify !" });
    } catch (error) {
      return res.status(400).json({ status: 400, message: error.message });
    }
  };

  forgotVerify = async (req, res) => {
    try {
      const { password } = req.body;
      const { token } = req.params;

      const user = await AdminModel.findOne({
        token,
        tokenExpiry: { $gt: Date.now() },
      });

      if (!user) throw new ErrHandle(400, "Token Expired!");

      // Update password using findOneAndUpdate
      user.password = password;
      user.token=undefined;
      user.tokenExpiry=undefined;
      await user.save();

      return res
        .status(200)
        .json({ status: 200, message: "Password changed successfully." });
    } catch (error) {
      return res.status(400).json({ status: 400, message: error.message });
    }
  };
}

const admin = new Admin();
export { admin };
