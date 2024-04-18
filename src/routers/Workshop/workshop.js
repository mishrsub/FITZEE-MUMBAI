import express from "express";
const router = new express.Router();
import { upload } from "../../services/multer.js";
import { workshop } from "../../controllers/Workshop/workshop.js";

router.route("/addWorkshop")
.post(upload.single("image"),workshop.addWorkshop);

router.route("/getWorkshop")
.get(workshop.getWorkshop);

router.route("/editWorkshop/:id")
.patch(upload.single("image"),workshop.editWorkshop);

router.route("/deleteWorkshop/:id")
.delete(workshop.deleteWorkshop);

router.route("/detail")
.post(workshop.addWorkshopDetail);

router.route("/detail/:_id")
.get(workshop.getWorkshopDetail);

router.route("/detail/:workshopId")
.patch(workshop.editWorkshopDetail);

router.route("/detail/:workshopId")
.delete(workshop.deleteWorkshopDetail);

export default router;
