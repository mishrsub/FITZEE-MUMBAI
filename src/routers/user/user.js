import express from "express";
import { user } from "../../controllers/user/user.js";
const router = new express.Router();

router.route("/register").post(user.register);
router.route("/login").post(user.login);
router.route("/enquiry/request").post(user.enquiry);
router.route("/enquiry/verify").post(user.enquiryVerify);
router.route("/enquiry/detail").post(user.enquiryDetail).get(user.getAllEnquiry);

export default router;
