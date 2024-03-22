import express from "express";
const router = new express.Router();
import { upload } from "../../services/multer.js";
import { testimonial } from "../../controllers/Testimonial/testimonial.js";

router.route("/addTestimonial")
.post(upload.single("image"),testimonial.addTestimonial);

router.route("/getTestimonial")
.get(testimonial.getTestimonial);

router.route("/editTestimonial/:id")
.patch(upload.single("image"),testimonial.editTestimonial);

router.route("/deleteTestimonial/:id")
.delete(testimonial.deleteTestimonial);

export default router;
