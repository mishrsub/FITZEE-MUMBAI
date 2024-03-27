import mongoose from "mongoose";
import { ClassModel } from "../../model/courses/Class.js";
import { ProgramModel } from "../../model/competitiveExam/Program.js";
import { ErrHandle } from "../../utils/ErrorHandler.js";
import { ProgramDetail } from "../../model/competitiveExam/ProgramDetail.js";

class AddClass {
  addClass = async (req, res) => {
    try {
      const { className } = req.body;
      console.log("classname3");
      const newClass = await ClassModel.findOneAndUpdate(
        { name: className, type: "competitive" },
        { name: className, type: "competitive" },
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
      const { heading, organisingBody, eligibleClass, about } = req.body;

      const getClass = await ClassModel.findById(classId);

      if (!getClass) {
        throw new ErrHandle(404, "Class not found.");
      }

      const existProgram = await ProgramModel.findOne({
        heading,
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
        heading,
        organisingBody,
        eligibleClass,
        about,
        image: req.file.filename,
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

  editClass = async (req, res) => {
    try {
      const { classId } = req.params;
      const { className } = req.body;

      //update class
      const classData = await ClassModel.findOne({
        _id: classId,
        type: "competitive",
      });

      if (!classData) {
        throw new ErrHandle(404, "Class not found.");
      }

      await ClassModel.findByIdAndUpdate(
        classData._id,
        {
          $set: {
            name: className,
          },
        },
        { new: true }
      );

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
      const { heading, organisingBody, eligibleClass, category } = req.body;

      const program = await ProgramModel.findById(programId);

      if (!program) {
        return res
          .status(404)
          .json({ status: 404, message: "Program not found" });
      }

      const updateData = {
        heading,
        organisingBody,
        eligibleClass,
        category,
      }

      const file = req.file.filename;
      if(file) {  
        updateData.image = req?.file?.filename;
      }

      await ProgramModel.findByIdAndUpdate(
        program._id,
        {
          $set: {
           ...updateData
          },
        },
        { new: true }
      );

      return res.status(200).json({
        status: 200,
        message: "Program updated successfully.",
      });
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  removeClass = async (req, res) => {
    try {
      const { classId } = req.params;

      //delete class
      const classData = await ClassModel.findOne({
        _id: classId,
        type: "competitive",
      });

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

      await ProgramModel.findByIdAndUpdate(
        programData._id,
        {
          $set: {
            isDeleted: !programData.isDeleted,
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

  //get class by id
  getClassById = async (req, res) => {
    try {
      const { _id } = req.params;

      const pipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(_id), // Convert string to ObjectId
            isDeleted:false
          },
        },
        {
          $lookup: {
            from: "program-competitives", // Name of the Program collection
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
            isDeleted:false
          },
        },
        {
          $lookup: {
            from: "program-competitives",
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
      const { className, paid } = req.query;
      const filter = { type: "competitive",isDeleted:false };

      if (className) {
        filter.name = className;
      }

      const pipeline = [
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "program-competitives",
            localField: "programs",
            foreignField: "_id",
            as: "programs",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
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
        programBrief,
        programDescription,
        programPoint,
        subjects,
      } = req.body;

      console.log("====================================");
      console.log(req.body);
      console.log("====================================");
      //  carosImg

      const program = await ProgramModel.findOne({
        _id: programId,
      });

      if (!program) {
        throw new ErrHandle(404, "Program not found.");
      }

      const alreadyAdded = await ProgramDetail.findOne({
        programId,
      });

      console.log("Already added: ", alreadyAdded);
      if (alreadyAdded) {
        throw new ErrHandle(400, "Program detail already exist.");
      }

      const addedProgram = await ProgramDetail.create({
        programId,
        programDetailImg: req.files.map((val) => val.filename),
        programBrief,
        programDescription,
        programPoint,
        subjects,
      });

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
      const { programId } = req.params;

      const getProgram = await ProgramModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(programId),
          },
        },
        {
          $lookup: {
            from: "competitive-program-details",
            localField: "_id",
            foreignField: "programId",
            as: "programDetail",
          },
        },
        {
          $unwind: "$programDetail",
        },
        {
          $addFields: {
            program: {
              _id: "$_id",
              name: "$name",
              classId: "$classId",
              image:"$image",
              heading:"$heading",
              organisingBody:"$organisingBody",
              like:"$like",
              eligibleClass:"$eligibleClass",
              isDeleted: "$isDeleted",
            },
            programDetail: "$programDetail",
          },
        },
        {
          $project: {
            _id: 0, // Exclude the _id field if you don't need it
            program: 1,
            programDetail: 1,
          },
        },
      ]);

      console.log("Result::::", getProgram);

      if (!getProgram) {
        throw new ErrHandle(404, "Program detail not found.");
      }

      return res.status(200).json({
        status: 200,
        data: {
          ...getProgram[0].program,
          ...getProgram[0].programDetail,
        },
      });
    } catch (error) {
      return res.status(400).json({ status: 400, error: error.message });
    }
  };

  editProgramDetail = async (req, res) => {
    try {
      const { programId } = req.params;
      const { programBrief, programDescription, programPoint, subjects } =
        req.body;

      const getProgram = await ProgramDetail.findOne({ programId });

      if (!getProgram) {
        throw new ErrHandle(404, "Program detail not found.");
      }

      console.log("====================================");
      console.log(getProgram);
      console.log("====================================");
      const editDetail = await ProgramDetail.findOneAndUpdate(
        { programId },
        {
          $set: {
            programDetailImg: req.files.map((val) => val.filename),
            programBrief,
            programDescription,
            programPoint:
              Array.isArray(programPoint).length > 0
                ? JSON.parse(programPoint)
                : getProgram.programPoint,
            subjects,
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
}

const addClass = new AddClass();
export { addClass };
