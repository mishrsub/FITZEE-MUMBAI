import express from "express";
const router = new express.Router();
import {eventMenu} from "../../controllers/Workshop/EventsMenu.js";

router
    .route("/menu")
    .post(eventMenu.addMenu)
    .get(eventMenu.getAdmissionTestMenus);
router.route("/menu/:menuId").post(eventMenu.addSubMenu);
router
    .route("/menu/:menuId")
    .patch(eventMenu.editMenu)
    .delete(eventMenu.deleteMenu);
router
    .route("/menu/:menuId/:id")
    .patch(eventMenu.editSubMenu)
    .delete(eventMenu.deleteSubMenu);

export default router;
