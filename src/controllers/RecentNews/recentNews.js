import BlogComment from "../../model/RecentNews/blogComments.js";
import RecentNews from "../../model/RecentNews/recentNews.js";
import { ErrHandle } from "../../utils/ErrorHandler.js";

class Blogs {
  addNews = async (req, res) => {
    try {
      const { title, description } = req.body;
      const image = req.file;

      const existed = await RecentNews.findOne({ title, description });

      if (existed) {
        throw new ErrHandle(400, "News already existed.");
      }

      const news = await RecentNews.create({
        title,
        description,
        image: image.filename,
      });

      return res
        .status(201)
        .json({ status: 201, message: "News added successfully." });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  getNews = async (req, res) => {
    try {
      const { search } = req.query;
      const searchQuery = {
        isDeleted: false, // Assuming you want only non-deleted testimonials
      };

      if (search) {
        // Use a regular expression to perform a case-insensitive search
        searchQuery.$or = [
          { title: { $regex: new RegExp(search, "i") } },
          { description: { $regex: new RegExp(search, "i") } },
        ];
      }

      const news = await RecentNews.find(searchQuery).sort({
        createdAt: -1,
      });

      return res.status(200).json({ status: 200, news });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  getBlogById = async (req, res) => {
    try {
      const { blogId } = req.params;
      const blog = await RecentNews.findOne({ _id: blogId });

      if (!blog) {
        throw new ErrHandle(404, "Blog not found");
      }

      return res.status(200).json({ status: 200, news: blog });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  editNews = async (req, res) => {
    try {
      console.log("hello");
      const { id } = req.params;
      const { title, description } = req.body;
      const image = req.file;

      const news = await RecentNews.findOne({ _id: id });

      if (!news) {
        throw new ErrHandle(404, "News not found.");
      }

      if (image) {
        news.image = image.filename;
      }

      const updatedNews = await RecentNews.findOneAndUpdate(
        { _id: news._id },
        {
          $set: {
            title,
            description,
            image,
          },
        },
        { new: true }
      );

      if (!updatedNews) {
        throw new ErrHandle(
          400,
          "Something went wrong during updating the news."
        );
      }

      return res
        .status(200)
        .json({ status: 200, message: "News updated successfully." });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  deleteNews = async (req, res) => {
    try {
      const { id } = req.params;

      const news = await RecentNews.findById(id);

      if (!news) {
        throw new ErrHandle(404, "News not found.");
      }

      news.isDeleted = true;
      const deleteNews = await news.save();

      if (!deleteNews) {
        throw new ErrHandle(400, "Something went wrong during remove News.");
      }

      return res
        .status(200)
        .json({ status: 200, message: "News removed Successfully." });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  createComment = async (req, res) => {
    try {
      const { blogId } = req.params;
      const { name,email,phone,description } = req.body;

      const blog = await RecentNews.findById(blogId);

      if (!blog) {
        throw new ErrHandle(404, "Blog not found.");
      }

      const comment = await BlogComment.create({
        name,
        description,
        email,
        phone
      });

      blog.commentId.push(comment._id);
      await blog.save();

      return res
        .status(201)
        .json({ status: 201, message: "Comment added Successfully." });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  getAllComments = async (req, res) => {
    try {
      const comments = await BlogComment.find({});

      return res.status(200).json({ status: 200, comments });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  getParticularBlogComments = async(req,res) =>{
    try {
        const { blogId } = req.params;

        const blog = await RecentNews.findById(blogId);

        if (!blog) {
          throw new ErrHandle(404, "Blog not found.");
        }

        const comments = await BlogComment.find({
            _id: { $in: blog.commentId } // Query for comments where the _id matches the blog.commentId
        });

        return res.status(200).json({ status: 200, comments });
    } catch (error) {
        return res.status(400).json({ status: 400, error: error.message });
    }
  }
}

const blog = new Blogs();
export { blog };
