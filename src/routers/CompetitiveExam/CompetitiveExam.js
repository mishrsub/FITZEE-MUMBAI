import express from "express";
const router = new express.Router();
import { addClass } from "../../controllers/CompetitiveCourses/CompetitiveCourse.js";
import { upload } from "../../services/multer.js";

router.route("/addClass").post(addClass.addClass);

router.route("/deleteClass/:classId").delete(addClass.removeClass);

router.route("/addProgram/:classId").post(upload.single("image"),addClass.addProgram);

router.route("/editClass/:classId").patch(addClass.editClass);

router.route("/editProgram/:programId").patch(upload.single("image"),addClass.editProgram);

router.route("/removeClass/:classId").delete(addClass.removeClass);

router.route("/removeProgram/:programId").delete(addClass.deleteProgram);

router.route("/").get(addClass.getAllClass);

router.route("/class/:_id").get(addClass.getClassById);

router
    .route("/class/:_id/program/:programId")
    .get(addClass.getClassAndProgramById);

router
    .route("/addProgramDetail")
    .post(upload.array("carosImg", 5), addClass.addProgramDetail);

router
    .route("/programDetail/:programId")
    .get(addClass.getProgramDetails)
    .patch(upload.array("carosImg", 5), addClass.editProgramDetail)
    .delete(addClass.deleteProgramDetail);

export default router;
