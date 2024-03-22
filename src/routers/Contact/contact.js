import express from "express";
const router = new express.Router();
import { contactUs } from "../../controllers/Contact/contact.js";

router.route("/").post(contactUs.addContact);
router.route("/all").get(contactUs.getAllContact);
router.route("/:id").delete(contactUs.deleteContact);

export default router;
