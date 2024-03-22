import express from "express";
const router = new express.Router();
import { upcomingTest } from "../../controllers/UpcomingAdmissionTest/upcomingAdmissionTest.js";

router.route("/addUpcomingUpcomingTest")
.post(upcomingTest.addAdmissionTest);

router.route("/getUpcomingTest")
.get(upcomingTest.getAdmissionTest);

router.route("/editUpcomingTest/:id")
.patch(upcomingTest.editAdmissionTest);

router.route("/deleteUpcomingTest/:id")
.delete(upcomingTest.deleteAdmissionTest);

export default router;
