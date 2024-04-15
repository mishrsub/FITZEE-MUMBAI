import express from "express";
const router = new express.Router();
import { download } from "../../controllers/download/download.js";
import { uploadFile } from "../../services/multer.js";

router.route("/menu").post(download.addMenu).get(download.getDownloadMenus);
router
    .route("/menu/:menuId")
    .post(uploadFile.single("file"), download.addSubMenu);
router
    .route("/menu/:menuId")
    .patch(download.editMenu)
    .delete(download.deleteMenu);
router
    .route("/menu/:menuId/:id")
    .patch(uploadFile.single("file"), download.editSubMenu)
    .delete(download.deleteSubMenu);

export default router;
