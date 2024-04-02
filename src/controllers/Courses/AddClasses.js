import mongoose from "mongoose";
import { ClassModel } from "../../model/courses/Class.js";
import { ProgramModel } from "../../model/courses/Program.js";
import { ErrHandle } from "../../utils/ErrorHandler.js";
import { ProgramDetail } from "../../model/courses/ProgramDetail.js";
import { SubprogramSchema } from "../../model/courses/SubProgram.js";

class AddClass {
  addClass = async (req, res) => {
    try {
      const { className } = req.body;

      const newClass = await ClassModel.findOneAndUpdate(
        { name: className, type: "programs" },
        { name: className, type: "programs" },
        { upsert: true, new: true }
      );

      res.status(201).json({
        status: 201,
        message: "Class added successfully.",
        data: newClass,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  deleteClass = async (req, res) => {
    try {
      const { classId } = req.params;
      const { className } = req.body;

      const newClass = await ClassModel.findOneAndUpdate(
        { _id: classId },
        { name: className },
        { new: true }
      );

      res.status(201).json({
        status: 201,
        message: "Class removed successfully.",
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  addProgram = async (req, res) => {
    try {
      const { classId } = req.params;
      const { programName } = req.body;

      const getClass = await ClassModel.findById(classId);

      if (!getClass) {
        throw new ErrHandle(404, "Class not found.");
      }

      const existProgram = await ProgramModel.findOne({
        name: programName.toLowerCase().trim(),
        classId,
      });

      if (existProgram) {
        throw new ErrHandle(
          400,
          "This program is already existed for this class."
        );
      }

      const isExistClass = getClass.programs.some(
        (val) =>
          existProgram && // Check if existProgram is not null or undefined
          val.toString() === existProgram._id.toString()
      );

      if (isExistClass) {
        throw new ErrHandle(400, "Program already existed.");
      }

      const newProgram = await ProgramModel.create({
        name: programName,
        classId,
      });

      getClass.programs.push(newProgram._id);
      await Promise.all([getClass.save(), newProgram.save()]);

      res.status(201).json({
        status: 201,
        message: "Program added successfully.",
        data: newProgram,
      });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  addSubProgram = async (req, res) => {
    try {
      const { programId } = req.params;
      const { subprogramName } = req.body;
      const programPic = req.file;

      console.log(programId);
      console.log(programPic);
      console.log(subprogramName.toLowerCase().trim());
      console.log(req.body);
      const program = await ProgramModel.findOne({ _id: programId });

      if (!program) {
        throw new ErrHandle(404, "Program not found.");
      }

      const isExistProgram = program.subprograms.some(
        (val) => val.name === subprogramName.toLowerCase()
      );

      if (isExistProgram) {
        throw new ErrHandle(400, "Sub Program already existed.");
      }

      program.subprograms.push({
        name: subprogramName,
        programImg: programPic.filename,
      });
      await program.save();

      return res.status(201).json({
        status: 201,
        message: "Sub Program added successfully.",
        data: program,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  editClass = async (req, res) => {
    try {
      const { classId } = req.params;
      const { className } = req.body;

      //update class
      const classData = await ClassModel.findById(classId);

      if (!classData) {
        throw new ErrHandle(404, "Class not found.");
      }

      console.log("====================================");
      console.log(classData);
      console.log("====================================");
      const update = await ClassModel.findByIdAndUpdate(
        classData._id,
        {
          $set: {
            name: className,
          },
        },
        { new: true }
      );

      console.log("====================================");
      console.log(update);
      console.log("====================================");
      return res
        .status(200)
        .json({ status: 200, message: "Class updated successfully" });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  editProgram = async (req, res) => {
    try {
      const { programId } = req.params;
      const { programName } = req.body;

      const program = await ProgramModel.findById(programId);

      if (!program) {
        return res
          .status(404)
          .json({ status: 404, message: "Program not found" });
      }

      await ProgramModel.findByIdAndUpdate(
        program._id,
        {
          $set: {
            name: programName,
          },
        },
        { new: true }
      );

      return res.status(200).json({
        status: 200,
        message: "Program updated successfully.",
      });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  editSubProgram = async (req, res) => {
    try {
      const { programId, subProgramId } = req.params;
      const { subprogramName } = req.body;

      const program = await ProgramModel.findById(programId);

      if (!program) {
        return res
          .status(404)
          .json({ status: 404, message: "Program not found" });
      }

      await ProgramModel.findOneAndUpdate(
        { "subprograms._id": subProgramId },
        {
          $set: {
            "subprograms.$.name": subprogramName,
          },
        },
        { new: true }
      );

      return res.status(200).json({
        status: 200,
        message: "Subprogram updated successfully.",
      });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  removeClass = async (req, res) => {
    try {
      const { classId } = req.params;

      //delete class
      const classData = await ClassModel.findById(classId);

      if (!classData) {
        throw new ErrHandle(404, "Class not found.");
      }

      await ClassModel.findByIdAndUpdate(
        classData._id,
        {
          $set: {
            isDeleted: !classData.isDeleted, // Toggle isDeleted field between true and false
          },
        },
        { new: true }
      );

      await ProgramModel.updateMany(
        { _id: { $in: classData.programs } },
        {
          $set: {
            isDeleted: true,
            "subprograms.$[].isDeleted": true,
          },
        },
        { new: true }
      );

      return res
        .status(200)
        .json({ status: 200, message: "Class deleted successfully" });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  deleteProgram = async (req, res) => {
    try {
      const { programId } = req.params;

      //delete class
      const programData = await ProgramModel.findById(programId);

      if (!programData) {
        throw new ErrHandle(404, "Program not found.");
      }

      await ProgramModel.updateMany(
        { _id: programId },
        {
          $set: {
            isDeleted: true,
            "subprograms.$[].isDeleted": true,
          },
        },
        { new: true }
      );

      return res
        .status(200)
        .json({ status: 200, message: "Program deleted successfully" });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  deleteSubProgram = async (req, res) => {
    try {
      const { programId, subProgramId } = req.params;

      const programData = await ProgramModel.findById(programId);

      if (!programData) {
        throw new ErrHandle(404, "Program not found.");
      }

      const updateProgram = await ProgramModel.findOneAndUpdate(
        { "subprograms._id": subProgramId },
        {
          $set: {
            "subprograms.$.isDeleted": true,
          },
        },
        { new: true }
      );

      if (!updateProgram) {
        throw new ErrHandle(400, "Something went wrong while updating");
      }

      return res.status(200).json({
        status: 200,
        message: "Sub program deleted successfully",
      });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  //get class by id
  getClassById = async (req, res) => {
    try {
      const { _id } = req.params;

      const pipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(_id), // Convert string to ObjectId
          },
        },
        {
          $lookup: {
            from: "programs", // Name of the Program collection
            localField: "programs",
            foreignField: "_id",
            as: "programData",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            programs: "$programData", // Replace 'programs' array with the joined data
          },
        },
      ];

      const result = await ClassModel.aggregate(pipeline);

      return res.status(200).json({ status: 200, data: result[0] });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  //get class and program by id
  getClassAndProgramById = async (req, res) => {
    try {
      const { _id, programId } = req.params;

      const pipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(_id),
          },
        },
        {
          $lookup: {
            from: "programs",
            localField: "programs",
            foreignField: "_id",
            as: "programData",
          },
        },
        {
          $unwind: "$programData",
        },
        {
          $match: {
            "programData._id": new mongoose.Types.ObjectId(programId),
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            programs: [{ $ifNull: ["$programData", []] }],
          },
        },
      ];

      const result = await ClassModel.aggregate(pipeline);

      if (result.length === 0) {
        return res
          .status(404)
          .json({ status: 404, message: "Program not found" });
      }

      return res.status(200).json({ status: 200, data: result[0] });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  getAllClass = async (req, res) => {
    try {
      const { className, isDeleted } = req.query;
      const filter = { type: "programs" };

      if (className) {
        filter.name = className;
      }
      // if(isDeleted) {
      //   filter.isDeleted = Boolean(isDeleted)
      // }

      const pipeline = [
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "programs",
            localField: "programs",
            foreignField: "_id",
            as: "programs",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            type: 1,
            programs: 1,
          },
        },
      ];

      const result = await ClassModel.aggregate(pipeline);

      return res.status(200).json({ status: 200, class: result });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  addProgramDetail = async (req, res) => {
    try {
      const {
        programId,
        subProgramId,
        programBrief,
        programDescription,
        programPoint,
        syllabusCovered,
        subjectTaught,
        goals,
        programSummary,
        batchStartDate,
        keyword
      } = req.body;

      //  carosImg

      console.log("====================================");
      console.log("FILES ADDED: ", req.body);
      console.log("====================================");
      const program = await ProgramModel.findOne({
        _id: programId,
        "subprograms._id": subProgramId,
      });

      if (!program) {
        throw new ErrHandle(404, "Program not found.");
      }

      const alreadyAdded = await ProgramDetail.findOne({
        programId,
        subProgramId,
      });

      console.log("Already added: ", alreadyAdded);
      if (alreadyAdded) {
        throw new ErrHandle(400, "Program detail already exist.");
      }

      const addedProgram = await ProgramDetail.create({
        programId,
        subProgramId,
        programDetailImg: req.files.map((val) => val.filename),
        programBrief,
        programDescription,
        programPoint,
        syllabusCovered,
        subjectTaught,
        goals,
        programSummary: JSON.parse(programSummary),
        batchStartDate: JSON.parse(batchStartDate),
        keyword
      });

      await ProgramModel.findOneAndUpdate(
        { _id: program._id, "subprograms._id": subProgramId },
        { $set: { "subprograms.$.programDetailId": addedProgram._id } },
        { new: true }
      );

      return res.status(201).json({
        status: 201,
        message: "Program detail added successfully.",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  getProgramDetails = async (req, res) => {
    try {
      const { programId, subProgramId } = req.params;

      const getProgram = await ProgramModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(programId),
            "subprograms._id": new mongoose.Types.ObjectId(subProgramId),
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            classId: 1,
            isDeleted: 1,
            subprograms: {
              $filter: {
                input: "$subprograms",
                as: "subprogram",
                cond: {
                  $eq: [
                    "$$subprogram._id",
                    new mongoose.Types.ObjectId(subProgramId),
                  ],
                },
              },
            },
          },
        },
        {
          $unwind: {
            path: "$subprograms",
            preserveNullAndEmptyArrays: true, // Preserve documents without subprograms
          },
        },
        {
          $lookup: {
            from: "programdetails",
            localField: "subprograms.programDetailId",
            foreignField: "_id",
            as: "programDetail",
          },
        },
        {
          $unwind: {
            path: "$programDetail",
            preserveNullAndEmptyArrays: true, // Preserve documents without programDetail
          },
        },
        {
          $addFields: {
            program: {
              _id: "$_id",
              name: "$name",
              classId: "$classId",
              isDeleted: "$isDeleted",
            },
            subprogram: "$subprograms",
            programDetail: "$programDetail",
          },
        },
        {
          $project: {
            _id: 0, // Exclude the _id field if you don't need it
            program: 1,
            subprogram: 1,
            programDetail: 1,
          },
        },
      ]);

      console.log("Result:", getProgram);

      if (!getProgram) {
        throw new ErrHandle(404, "Program detail not found.");
      }

      return res.status(200).json({
        status: 200,
        data: {
          ...getProgram[0].program,
          matchedSubprogram: getProgram[0].subprogram,
          ...getProgram[0].programDetail,
        },
      });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  editProgramDetail = async (req, res) => {
    try {
      const { programId, subProgramId } = req.params;
      const { programBrief, programDescription, programPoint } = req.body;

      const getProgram = await ProgramDetail({ programId, subProgramId });

      if (!getProgram) {
        throw new ErrHandle(404, "Program detail not found.");
      }

      const editDetail = await ProgramDetail.findOneAndUpdate(
        { programId, subProgramId },
        {
          $set: {
            programDetailImg: req.files.map((val) => val.filename),
            programBrief,
            programDescription,
            programPoint: JSON.parse(programPoint),
          },
        },
        { new: true }
      );

      return res.status(200).json({ status: 200, programDetail: editDetail });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  deleteProgramDetail = async (req, res) => {
    try {
      const { programId, subProgramId } = req.params;
      const { programStatus } = req.body;

      const getProgram = await ProgramDetail({ programId, subProgramId });

      if (!getProgram) {
        throw new ErrHandle(404, "Program detail not found.");
      }

      await ProgramDetail.findOneAndUpdate(
        { programId, subProgramId },
        {
          $set: {
            programStatus,
          },
        },
        { new: true }
      );

      return res
        .status(200)
        .json({ status: 200, programDetail: "Updated successfully" });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  //adding review
  addReview = async (req, res) => {
    try {
      const {
        programId,
        subprogramId,
        name,
        email,
        phone,
        programName,
        message,
        rating,
      } = req.body;

      const program = await ProgramModel.findOne({
        _id: programId,
        "subprograms._id": subprogramId,
      });

      if (!program) {
        throw new ErrHandle(404, "Subprogram not found.");
      }

      const subProgram = program.subprograms.find(
        (val) => val._id.toString() == subprogramId
      );

      console.log(subProgram);

      const totalRating = subProgram.review.reduce(
        (sum, review) => sum + review.rating,
        0
      );

      // Check if there are no reviews yet to avoid dividing by zero
      const averageRating =
        subProgram.numOfReviews === 0
          ? 0
          : totalRating / subProgram.numOfReviews;

      console.log(averageRating);
      const newReview = {
        name,
        email,
        phone,
        programName,
        message,
        rating,
        averageRating,
      };

      subProgram.review.push(newReview);
      subProgram.numOfReviews += 1;
      subProgram.averageRating = newReview.averageRating;

      await program.save();

      return res
        .status(201)
        .json({ status: 201, message: "Review added successfully." });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  getReviews = async (req, res) => {
    try {
      const { subProgramId } = req.params;

      const getAllReview = await ProgramModel.findOne({
        "subprograms._id": subProgramId,
      });

      if (!getAllReview) {
        throw new ErrHandle(404, "Subprogram not found.");
      }

      const reviews = getAllReview.subprograms.find(
        (val) => val._id.toString() === subProgramId
      );

      return res.status(200).json({ status: 200, reviews: reviews.review });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };
}

const addClass = new AddClass();
export { addClass };
