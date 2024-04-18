import UpcomingAdmissionTest from "../../model/admissionTest/upcomingAdmissionTest.js"
import { ErrHandle } from "../../utils/ErrorHandler.js";
import mongoose from "mongoose"

class UpcomingTest {
        addAdmissionTest = async(req,res) =>{
            try {
                const { examName,examDate,eligibleClass,urlName } = req.body;

                const addTest = await UpcomingAdmissionTest.create({
                    examName,examDate,eligibleClass,urlName
                });

                return res.status(201).json({status:201,message:"Test Added Successfully.",admissionTestData:addTest});
            } catch (error) {
                console.log(error);
                return res.status(400).json({status:400,error:error.message});
            }
        }

        enabledTest = async (req, res) => {
            try {
                const { id } = req.params;
                const { enable } = req.body;
        
                // Find the test data by its ID and update it with the new enable value
                const testData = await UpcomingAdmissionTest.findOneAndUpdate(
                    { _id: id },
                    { $set: { enable } },
                    { new: true } // Return the modified document after update
                );
        
                // If test data is not found, throw an error
                if (!testData) {
                    throw new Error("Test not found.");
                }
        
                console.log("Test enabled Successfully.");
        
                return res.status(200).json({ status: 200, message: "Test enabled Successfully." });
            } catch (error) {
                console.log(error);
                return res.status(400).json({ status: 400, error: error.message });
            }
        }
        

        getAdmissionTest = async(req,res) =>{
            try {
                const {search,enable } = req.query;

                const searchQuery = {
                    isDeleted: false, // Assuming you want only non-deleted testimonials
                };
        
                if (search) {
                    // Use a regular expression to perform a case-insensitive search
                    searchQuery.$or = [
                        { examName: { $regex: new RegExp(search, 'i') } }
                    ];
                }
                if(enable) {
                    searchQuery.enable = true;
                }

                const test = await UpcomingAdmissionTest.find(searchQuery);
                const count = await UpcomingAdmissionTest.countDocuments(searchQuery);

                return res.status(200).json({status:200,test,count});
            } catch (error) {
                return res.status(400).json({status:400,error:error.message});
            }
        }

        editAdmissionTest = async(req,res) =>{
            try {
                const { id } = req.params;
                const { examName,examDate,urlName,eligibleClass } = req.body;

                const test = await UpcomingAdmissionTest.findOne({ _id:id });

                if(!test) {
                    throw new ErrHandle(404,"Test not found.")
                }

                const updatedTest = await UpcomingAdmissionTest.findOneAndUpdate({_id:test._id},{
                    $set:{
                        examName,examDate,
                        eligibleClass,
                        urlName
                    }
                })

                if (!updatedTest) {
                    throw new ErrHandle(400, "Something went wrong during updating the test.");
                }

                return res.status(200).json({ status: 200, message: "Test updated successfully." });
                    } catch (error) {
                return res.status(400).json({status:400,error:error.message});
            }
        }

        deleteAdmissionTest = async(req,res) =>{
            try {
                const { id } = req.params;

                const test = await UpcomingAdmissionTest.findById(id);

                if(!test) {
                    throw new ErrHandle(404,"Testimonial not found.")
                }

                test.isDeleted = true;
                const deleteTestimonial = await test.save();

                if(!deleteTestimonial) {
                    throw new ErrHandle(400,"Something went wrong during remove test.");
                }

                return res.status(200).json({status:200,message:"Test removed Successfully."});
            } catch (error) {
                return res.status(400).json({status:400,error:error.message});
            }
        }
}

const upcomingTest = new UpcomingTest();
export { upcomingTest };