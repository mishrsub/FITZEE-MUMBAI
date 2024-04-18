import express from "express";
import { admin } from "../../controllers/user/admin.js";
const router = new express.Router();

router.route("/login").post(admin.login);
router.route("/forget/request").post(admin.forgotRequest);
router.route("/forget/verify/:token").get(admin.forgotVerifyPage);
router.route("/forget/verify/:token").patch(admin.forgotVerify);

export default router;
