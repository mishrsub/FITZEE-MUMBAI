import express from "express";
const router = new express.Router();
import { addClass } from "../../controllers/Courses/AddClasses.js";
import { upload } from "../../services/multer.js";

router.route("/addClass").post(addClass.addClass);

router.route("/deleteClass/:classId").delete(addClass.removeClass);

router.route("/addProgram/:classId").post(addClass.addProgram);

router
    .route("/addSubProgram/:programId")
    .post(upload.single("program"), addClass.addSubProgram);

router.route("/editClass/:classId").patch(addClass.editClass);

router.route("/editProgram/:programId").patch(addClass.editProgram);

router
    .route("/editSubProgram/:programId/:subProgramId")
    .patch(addClass.editSubProgram);

router.route("/removeClass/:classId").delete(addClass.deleteClass);

router.route("/removeProgram/:programId").delete(addClass.deleteProgram);

router
    .route("/removeSubProgram/:programId/:subProgramId")
    .delete(addClass.deleteSubProgram);

router.route("/").get(addClass.getAllClass);

router.route("/class/:_id").get(addClass.getClassById);

router
    .route("/class/:_id/program/:programId")
    .get(addClass.getClassAndProgramById);

router
    .route("/addProgramDetail")
    .post(upload.array("carosImg", 5), addClass.addProgramDetail);

router
    .route("/programDetail/:programId/:subProgramId")
    .get(addClass.getProgramDetails)
    .patch(upload.array("carosImg", 5), addClass.editProgramDetail)
    .delete(addClass.deleteProgramDetail);

router.route("/program/review").post(addClass.addReview);

router.route("/program/review/:subProgramId").get(addClass.getReviews);

router.route("/addGroup").post(addClass.addGroup);

router.route("/getGroups").get(addClass.getGroups);

router.route("/group/:id").get(addClass.getGroupDataById);

router.route("/separate/programs").get(addClass.getParticularSeparatePrograms);

export default router;
