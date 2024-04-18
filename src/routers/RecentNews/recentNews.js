import express from "express";
const router = new express.Router();
import { upload } from "../../services/multer.js";
import { blog } from "../../controllers/RecentNews/recentNews.js";

router.route("/addNews").post(upload.single("image"), blog.addNews);

router.route("/getNews").get(blog.getNews);

router.route("/getBlog/:blogId").get(blog.getBlogById);

router
    .route("/editNews/:id")
    .patch(upload.single("image"), blog.editNews);

router.route("/deleteNews/:id").delete(blog.deleteNews);

router.route("/comment/:blogId").post(blog.createComment).get(blog.getParticularBlogComments);
router.route("/comments").get(blog.getAllComments);

export default router;
