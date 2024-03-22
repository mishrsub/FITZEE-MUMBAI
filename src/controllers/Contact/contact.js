import ContactUs from "../../model/enquiryContactUs/contact.js";
import { ErrHandle } from "../../utils/ErrorHandler.js";
import { sendingMail } from "../../utils/sendMail.js";

class Contact {
  addContact = async (req, res) => {
    try {
      const { name, mobile, email, message, type } = req.body;

      console.log("====================================");
      console.log(req.body);
      console.log("====================================");
      const user = await ContactUs.create({
        name,
        mobile,
        email,
        message,
        type,
      });

      if (user) {
        res.status(200).json({ status: 200, message: "Enquiry successfully." });
      }

      await sendingMail(user, "CONTACT_US");
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  getAllContact = async (req, res) => {
    try {
      const contact = await ContactUs.find({});

      return res.status(200).json({ status: 200, contact });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  deleteContact = async(req,res) =>{
    try {
      const { id } = req.params;

      const contact = await ContactUs.findOne({_id:id});

      if(!contact) {
        throw new ErrHandle(404,"Contact not found.")
      }

      // await ContactUs.findByIdAndDelete(contact._id); 

      return res.status(200).json({ status: 200, message:"Contact deleted successfully." });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  }
}

const contactUs = new Contact();
export { contactUs };
