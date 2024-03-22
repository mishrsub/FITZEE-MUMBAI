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

export default router;
