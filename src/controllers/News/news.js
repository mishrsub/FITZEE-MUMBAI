import { ErrHandle } from "../../utils/ErrorHandler.js";
import { NewsModel } from "../../model/news/News.js";
import NewsComment from "../../model/news/NewsComments.js";

class MainNews {
    addNews = async (req, res) => {
        try {
            const { title, description, author } = req.body;

            const addNews = await NewsModel.create({
                title,
                description,
                author,
            });

            res.status(201).json({
                status: 201,
                message: "News added successfully.",
            });
        } catch (error) {
            console.error("Error:", error);
            return res.status(400).json({ status: 400, error: error.message });
        }
    };

    editNews = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, author } = req.body;

            const newsExist = await NewsModel.findOne({ _id: id });

            if (!newsExist) {
                throw new ErrHandle(404, "News not exist");
            }

            const newClass = await NewsModel.findByIdAndUpdate(
                newsExist._id,
                {
                    $set: {
                        title,
                        description,
                        author,
                    },
                },
                { new: true }
            );

            res.status(200).json({
                status: 200,
                message: "News updated successfully.",
            });
        } catch (error) {
            console.error("Error:", error);
            return res.status(400).json({ status: 400, error: error.message });
        }
    };

    deleteNews = async (req, res) => {
        try {
            const { id } = req.params;

            const newsExist = await NewsModel.findOne({ _id: id });

            if (!newsExist) {
                throw new ErrHandle(404, "News not exist");
            }

            const newClass = await NewsModel.findByIdAndDelete(id);

            res.status(200).json({
                status: 200,
                message: "News removed successfully.",
            });
        } catch (error) {
            console.error("Error:", error);
            return res.status(400).json({ status: 400, error: error.message });
        }
    };

    getNews = async (req, res) => {
        try {
            const { startDate, endDate } = req.query;

            const query = {};
            if (startDate && endDate) {
                query.createdAt = {
                    $gte: new Date(startDate),
                    $lt: new Date(endDate),
                };
            }

            console.log(query);

            const getNews = await NewsModel.find(query).sort({
                createdAt: -1,
            });

            res.status(200).json({
                status: 200,
                news: getNews,
            });
        } catch (error) {
            return res.status(400).json({ status: 400, error: error.message });
        }
    };

    toggleLikeNews = async (req, res) => {
        try {
            const { id } = req.params;
            const ip = req.ip; // Extract IP address from request

            // console.log(req.connection.remoteAddress);
            const news = await NewsModel.findById(id);

            if (!news) {
                return res
                    .status(404)
                    .json({ status: 404, message: "News not found." });
            }

            await news.toggleLike(ip);

            res.json({
                status: 200,
                message: "Like toggled successfully.",
                data: news,
            });
        } catch (error) {
            console.error("Error:", error);
            return res.status(400).json({ status: 400, error: error.message });
        }
    };

    createComment = async (req, res) => {
        try {
          const {newsId } = req.params;
          const { name,email,phone,description } = req.body;
    
          const news = await NewsModel.findById(newsId);
    
          if (!news) {
            throw new ErrHandle(404, "News not found.");
          }
    
          const comment = await NewsComment.create({
            name,
            description,
            email,
            phone
          });
    
          news.commentId.push(comment._id);
          await news.save();
    
          return res
            .status(201)
            .json({ status: 201, message: "Comment added Successfully." });
        } catch (error) {
          return res.status(400).json({ status: 400, error: error.message });
        }
      };
    
      getAllComments = async (req, res) => {
        try {
          const comments = await NewsComment.find({});
    
          return res.status(200).json({ status: 200, comments });
        } catch (error) {
          return res.status(400).json({ status: 400, error: error.message });
        }
      };
    
      getParticularNewsComments = async(req,res) =>{
        try {
            const { newsId } = req.params;
    
            const news = await NewsModel.findById(blogId);
    
            if (!news) {
              throw new ErrHandle(404, "News not found.");
            }
    
            const comments = await NewsComment.find({
                _id: { $in: news.commentId } // Query for comments where the _id matches the blog.commentId
            });
    
            return res.status(200).json({ status: 200, comments });
        } catch (error) {
            return res.status(400).json({ status: 400, error: error.message });
        }
      }
}

const mainNews = new MainNews();
export { mainNews };
