import express from "express";
const router = new express.Router();
import { admissionTest } from "../../controllers/AdmissionTestLink/testLink.js";

router
    .route("/menu")
    .post(admissionTest.addMenu)
    .get(admissionTest.getAdmissionTestMenus);
router.route("/menu/:menuId").post(admissionTest.addSubMenu);
router
    .route("/menu/:menuId")
    .patch(admissionTest.editMenu)
    .delete(admissionTest.deleteMenu);
router
    .route("/menu/:menuId/:id")
    .patch(admissionTest.editSubMenu)
    .delete(admissionTest.deleteSubMenu);

export default router;
