import { ResultModel } from "../../model/result/result.js";
import { ErrHandle } from "../../utils/ErrorHandler.js";

class Result {
    addResult = async (req, res) => {
        try {
            const { programName, eligibleClass, subjectsCovered, date } =
                req.body;

            const program = await ResultModel.findOne({ programName });

            if (program) {
                throw new ErrHandle(400, "Program result already exist.");
            }

            const saveResult = await ResultModel.create({
                programName,
                eligibleClass:eligibleClass.split(",").map((val) =>({name:val})),
                subjectsCovered:subjectsCovered.split(",").map((val) =>({name:val})),
                date,
                programImg: req.file.filename,
            });

            return res
                .status(201)
                .json({ status: 201, message: "Result created successfully." });
        } catch (error) {
            return res
                .status(400)
                .json({ status: 400, message: error.message });
        }
    };

    addPassingYear = async (req, res) => {
        try {
            const { _id, passingYear } = req.body;

            const program = await ResultModel.findOne({ _id });

            if (!program) {
                throw new ErrHandle(404, "Program result not found.");
            }

            const resultExist = await ResultModel.findOne({
                _id,
                "passingYears.year": passingYear,
            });

            if (resultExist) {
                throw new ErrHandle(404, "Result already exist of this year.");
            }

            // Add the passing year information to the existing program
            program.passingYears.push({
                year: passingYear,
                image: req.files.map((val) => val.filename),
            });

            await program.save();

            return res.status(201).json({
                status: 201,
                message: "Passing year added successfully.",
            });
        } catch (error) {
            return res
                .status(400)
                .json({ status: 400, message: error.message });
        }
    };

    editPassingYear = async (req, res) => {
        try {
            const { id } = req.params;
            const { passingYear } = req.body;
            const image = req.files;

            const resultExist = await ResultModel.findOne({
                "passingYears.year": passingYear,
            });

            if (resultExist) {
                throw new ErrHandle(404, "Result already exist of this year.");
            }

            // Use findByIdAndUpdate to directly update the passing year entry
            const updatedProgram = await ResultModel.findOneAndUpdate(
                { "passingYears._id": id },
                {
                    $set: {
                        "passingYears.$.year": passingYear,
                        "passingYears.$.image": image.map(
                            (val) => val.filename
                        ),
                    },
                },
                { new: true }
            );

            if (!updatedProgram) {
                throw new ErrHandle(404, "Program result not found.");
            }

            //   const existingYear = program.passingYears.find((year) => year._id == id);
            //   existingYear.year = passingYear;
            //   existingYear.image = image;
            //   await program.save();

            return res.status(200).json({
                status: 200,
                message: "Passing year updated successfully.",
            });
        } catch (error) {
            return res
                .status(400)
                .json({ status: 400, message: error.message });
        }
    };

    getResult = async (req, res) => {
        try {
            const result = await ResultModel.find({});

            return res.status(200).json({ status: 200, result });
        } catch (error) {
            return res
                .status(400)
                .json({ status: 400, message: error.message });
        }
    };

    getResultById = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await ResultModel.findOne({ _id: id });

            if (!result) {
                throw new ErrHandle(404, "Result not found.");
            }

            return res.status(200).json({ status: 200, result });
        } catch (error) {
            return res
                .status(400)
                .json({ status: 400, message: error.message });
        }
    };

    editResult = async (req, res) => {
        try {
            const { id } = req.params;
            const { programName, eligibleClass, subjectsCovered, date } =
                req.body;
            const img = req.file.filename;
            const editedData = {
                programName,
                eligibleClass,
                subjectsCovered,
                date,
            }

            if(req?.file) {
                editedData.programImg = img;
            }

            const saveResult = await ResultModel.findByIdAndUpdate(id, {
                $set: editedData,
            });

            return res
                .status(200)
                .json({ status: 200, message: "Result updated successfully." });
        } catch (error) {
            return res
                .status(400)
                .json({ status: 400, message: error.message });
        }
    };

    deleteResult = async (req, res) => {
        try {
            const { id } = req.params;

            await ResultModel.findByIdAndDelete(id);

            return res
                .status(200)
                .json({ status: 200, message: "Result deleted successfully." });
        } catch (error) {
            return res
                .status(400)
                .json({ status: 400, message: error.message });
        }
    };
}

const result = new Result();
export { result };
