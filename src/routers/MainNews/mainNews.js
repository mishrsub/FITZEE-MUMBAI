import express from "express";
const router = new express.Router();
import { mainNews } from "../../controllers/News/news.js";

router.route("/addNews")
.post(mainNews.addNews);

router.route("/getNews")
.get(mainNews.getNews);

router.route("/editNews/:id")
.patch(mainNews.editNews);

router.route("/deleteNews/:id")
.delete(mainNews.deleteNews);

router.route("/like/:id")
.post(mainNews.toggleLikeNews);

router.route("/comment/:newsId").post(mainNews.createComment).get(mainNews.getParticularNewsComments);
router.route("/comments").get(mainNews.getAllComments);

export default router;
