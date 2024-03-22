import express from "express";
const router = new express.Router();
import { upload } from "../../services/multer.js";
import { result } from "../../controllers/Result/result.js";

router
    .route("/")
    .post(upload.single("image"), result.addResult)
    .get(result.getResult);

router.route("/:id").get(result.getResultById);

router.route("/addYear").post(upload.array("image", 15), result.addPassingYear);

router
    .route("/editYear/:id")
    .patch(upload.single("image"), result.editPassingYear);

router
    .route("/:id")
    .patch(upload.single("image"), result.editResult)
    .delete(result.deleteResult);

export default router;
