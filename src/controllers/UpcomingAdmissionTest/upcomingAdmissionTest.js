import UpcomingAdmissionTest from "../../model/admissionTest/upcomingAdmissionTest.js"
import { ErrHandle } from "../../utils/ErrorHandler.js";

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

        getAdmissionTest = async(req,res) =>{
            try {
                const {search } = req.query;

                const searchQuery = {
                    isDeleted: false, // Assuming you want only non-deleted testimonials
                };
        
                if (search) {
                    // Use a regular expression to perform a case-insensitive search
                    searchQuery.$or = [
                        { examName: { $regex: new RegExp(search, 'i') } }
                    ];
                }

                const test = await UpcomingAdmissionTest.find(searchQuery);

                return res.status(200).json({status:200,test});
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
                    throw new ErrHandle(404,"Testimonial not found.")
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