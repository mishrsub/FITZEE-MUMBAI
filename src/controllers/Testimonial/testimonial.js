import Testimonials from "../../model/Testimonials/testimonials.js"
import { ErrHandle } from "../../utils/ErrorHandler.js";

class TestMonial {
        addTestimonial = async(req,res) =>{
            try {
                const { name,program,description,rank } = req.body;
                const image = req.file;

                const existed = await Testimonials.findOne({name,program,rank});

                if(existed) {
                    throw new ErrHandle(400,"Testimonial already existed.")
                }

                const addTest = await Testimonials.create({
                    name,program,description,rank,
                    image:image.filename,
                });

                return res.status(200).json({status:201,message:"Testimonial added successfully."});
            } catch (error) {
                console.log(error);
                return res.status(400).json({status:400,error:error.message});
            }
        }

        getTestimonial = async(req,res) =>{
            try {
                const { search } = req.query;

                const searchQuery = {
                    isDeleted: false, // Assuming you want only non-deleted testimonials
                };
        
                if (search) {
                    // Use a regular expression to perform a case-insensitive search
                    searchQuery.$or = [
                        { name: { $regex: new RegExp(search, 'i') } },
                        { program: { $regex: new RegExp(search, 'i') } },
                        { description: { $regex: new RegExp(search, 'i') } },
                    ];
                }
                const testimonial = await Testimonials.find(searchQuery);

                return res.status(200).json({status:200,testimonial});
            } catch (error) {
                return res.status(400).json({status:400,error:error.message});
            }
        }

        editTestimonial = async(req,res) =>{
            try {
                const { id } = req.params;
                const { name,program,description,rank } = req.body;
                console.log('====================================');
                console.log(req.file);
                console.log('====================================');
                const image = req.file;


                const testimonial = await Testimonials.findOne({ _id:id });

                if(!testimonial) {
                    throw new ErrHandle(404,"Testimonial not found.")
                }


                if (image) {
                    testimonial.image = image.filename;
                }

                const updatedTestimonial = await Testimonials.findOneAndUpdate({_id:testimonial._id},{
                    $set:{
                        name,program,description,
                        rank,
                        image:image ? image.filename : testimonial.image,
                    }
                })

                if (!updatedTestimonial) {
                    throw new ErrHandle(400, "Something went wrong during updating the testimonial.");
                }

                return res.status(200).json({ status: 200, message: "Testimonial updated successfully." });
                    } catch (error) {
                return res.status(400).json({status:400,error:error.message});
            }
        }

        deleteTestimonial = async(req,res) =>{
            try {
                const { id } = req.params;

                const testimonial = await Testimonials.findById(id);

                if(!testimonial) {
                    throw new ErrHandle(404,"Testimonial not found.")
                }

                testimonial.isDeleted = true;
                const deleteTestimonial = await testimonial.save();

                if(!deleteTestimonial) {
                    throw new ErrHandle(400,"Something went wrong during remove testimonial.");
                }

                return res.status(200).json({status:200,message:"Testimonial removed Successfully."});
            } catch (error) {
                return res.status(400).json({status:400,error:error.message});
            }
        }
}

const testimonial = new TestMonial();
export { testimonial };