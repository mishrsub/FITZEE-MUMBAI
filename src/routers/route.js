import userRouter from "../routers/user/user.js";
import testimonialRoute from "../routers/Testimonial/testimonial.js";
import newsRoute from "../routers/RecentNews/recentNews.js";
import upcomingTestRoute from "../routers/UpcomingAdmissionTest/upcomingAdmissionTest.js";
import courseRoute from "../routers/Courses/courses.js";
import competitiveCourseRoute from "../routers/CompetitiveExam/CompetitiveExam.js";
import contactRoute from "../routers/Contact/contact.js";
import resultRouter from "../routers/Result/myResult.js";
import workshopRouter from "../routers/Workshop/workshop.js";
import mainNewsRouter from "../routers/MainNews/mainNews.js";
import faqRouter from "../routers/Faq/faq.js";
import adminRoute from "../routers/user/admin.js";
import downloadRoute from "../routers/download/download.js";
import admissionTestRoute from "../routers/AdmissionTest/admissionTest.js";
import eventRouter from "../routers/Event/event.js";

import express from "express";
const router = new express.Router();

router.use("/admin", adminRoute);
router.use("/user", userRouter);
router.use("/news", newsRoute);
router.use("/testimonial", testimonialRoute);
router.use("/upcomingTest", upcomingTestRoute);
router.use("/course", courseRoute);
router.use("/course/competitive", competitiveCourseRoute);
router.use("/course/result", resultRouter);
router.use("/event", eventRouter);
router.use("/workshop", workshopRouter);
router.use("/mainNews", mainNewsRouter);
router.use("/contact", contactRoute);
router.use("/faq", faqRouter);
router.use("/downloads", downloadRoute);
router.use("/admissionTest", admissionTestRoute);

export default router;
