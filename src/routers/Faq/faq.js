import express from "express";
const router = new express.Router();
import { faq } from "../../controllers/Faq/faq.js";

router.route("/")
.post(faq.addFaq)
.get(faq.getFaq);

router.route("/:id")
.delete(faq.deleteFaq);

export default router;
