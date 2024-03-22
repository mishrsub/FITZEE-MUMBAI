import { ErrHandle } from "../../utils/ErrorHandler.js";
import { WorkshopModel } from "../../model/events/workshops/Workshops.js";
import { WorkshopDetailModel } from "../../model/events/workshops/workshopDetail.js";
import mongoose from "mongoose";

class Workshop {
    addWorkshop = async (req, res) => {
    try {
      const { title, description, address, timing, catalog } = req.body;

      const saveData = await WorkshopModel.create({
        title,
        description,
        address,
        timing,
        image: req.file.filename,
        catalog,
      });

      return res
        .status(201)
        .json({ status: 201, message: "Workshop added successfully." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: 400, message: error.message });
    }
  };

  getWorkshop = async (req, res) => {
    try {
      const { catalog, location, date, category } = req.query;

      console.log("====================================");
      console.log(catalog);
      console.log("====================================");

      // Build the query based on the provided parameters
      const query = {};
      if (catalog) query.catalog = catalog;
      if (location) query.location = location;
      if (date) query.date = date;
      if (category) query.category = category;

      const getAllWorkshop = await WorkshopModel.find(query).sort({
        createdAt: -1,
      });

      return res.status(200).json({ status: 200, workshops: getAllWorkshop });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: 400, message: error.message });
    }
  };

  editWorkshop = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, address, timing, catalog } = req.body;
  
      const getWorkshop = await WorkshopModel.findOne({ _id: id });
  
      if (!getWorkshop) {
        throw new ErrHandle(404, "Workshop not found.");
      }
  
      const updateFields = {
        title,
        description,
        address,
        timing,
        catalog,
      };
  
      // Check if image is present in the request
      if (req.file) {
        updateFields.image = req.file.filename;
      }
  
      const updateWorkshop = await WorkshopModel.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true }
      );
  
      if (!updateWorkshop) {
        throw new ErrHandle(404, "Workshop not found.");
      }
  
      return res.status(200).json({
        status: 200,
        message: "Workshop updated successfully.",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: 400, message: error.message });
    }
  };
  

  deleteWorkshop = async (req, res) => {
    try {
      const { id } = req.params;

      const getWorkshop = await WorkshopModel.findOne({ _id: id });

      if (!getWorkshop) {
        throw new ErrHandle(404, "Workshop not found.");
      }

      const deletedWorkshop = await WorkshopModel.findByIdAndDelete(id);

      if (!deletedWorkshop) {
        throw new ErrHandle(404, "Workshop not found.");
      }

      return res
        .status(200)
        .json({ status: 200, message: "Workshop deleted successfully." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: 400, message: error.message });
    }
  };

  addWorkshopDetail = async (req, res) => {
    try {
      const { workshopId, subTitle } = req.body;

      const getWorkshop = await WorkshopModel.findOne({ _id: workshopId });

      if (!getWorkshop) {
        throw new ErrHandle(404, "Workshop not found.");
      }

      const existDetail = await WorkshopDetailModel.findOne({
        _id: getWorkshop.workshopDetailId,
      });

      if (existDetail) {
        throw new ErrHandle(400, "Detail already exist.");
      }

      const addDetail = await WorkshopDetailModel.create({
        workshopId,
        subTitle,
      });

      getWorkshop.workshopDetailId = addDetail._id;
      await getWorkshop.save();

      return res
        .status(200)
        .json({ status: 200, message: "Detail added successfully." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: 400, message: error.message });
    }
  };

  getWorkshopDetail = async (req, res) => {
    try {
      const { _id } = req.params;

      // const getWorkshop = await WorkshopModel.aggregate([
      //   {
      //     $match: {
      //       _id: new mongoose.Types.ObjectId(_id),
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "workshop-details",
      //       localField:"_id",
      //       foreignField:"workshopId",
      //       as: "detail",
      //     },
      //   },
      //   {
      //     $unwind: "$detail",
      //   },
      //   {
      //     $project: {
      //       title: "$title",
      //       description: "$description",
      //       address: "$address",
      //       timing: "$timing",
      //       image: "$image",
      //       catalog: "$catalog",
      //       detail: "$detail",
      //     },
      //   },
      // ]);

      const getWorkshop = await WorkshopModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(_id),
          },
        },
        {
          $lookup: {
            from: "workshop-details",
            let: { workshopId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$workshopId", "$$workshopId"],
                  },
                },
              },
            ],
            as: "detail",
          },
        },
        {
          $unwind: "$detail",
        },
        {
          $project: {
            title: "$title",
            description: "$description",
            address: "$address",
            timing: "$timing",
            image: "$image",
            catalog: "$catalog",
            detail: "$detail",
          },
        },
      ]);

      if (!getWorkshop[0]) {
        throw new ErrHandle(404, "Workshop not found.");
      }

      return res.status(200).json({ status: 200, workshopDetail: getWorkshop[0] ?? {} });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: 400, message: error.message });
    }
  };

  editWorkshopDetail = async (req, res) => {
    try {
      const { workshopId } = req.params;
      const { title, description } = req.body;

      const updateWorkshop = await WorkshopDetailModel.findOneAndUpdate(
        {
          "subTitle._id": workshopId,
        },
        {
          $set: {
            "subTitle.$.title": title,
            "subTitle.$.description": description,
          },
        },
        { new: true }
      );

      if (!updateWorkshop) {
        throw new ErrHandle(404, "Workshop not found.");
      }

      return res.status(200).json({
        status: 200,
        message: "Workshop detail updated successfully.",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: 400, message: error.message });
    }
  };

  deleteWorkshopDetail = async (req, res) => {
    try {
      const { workshopId } = req.params;

      const getWorkshop = await WorkshopDetailModel.findOne({ workshopId });

      if (!getWorkshop) {
        throw new ErrHandle(404, "Workshop not found.");
      }

      return res
        .status(200)
        .json({ status: 200, message: "Detail added successfully." });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: 400, message: error.message });
    }
  };
}

const workshop = new Workshop();
export { workshop };
