import { FaqModel } from "../../model/faq/Faq.js";
import { ErrHandle } from "../../utils/ErrorHandler.js";

class Faq {
    addFaq = async(req,res) =>{
        try {
            const { heading,description } = req.body;

            const question = await FaqModel.create({ heading,description });
            
            return res.status(201).json({status:201,message:"Faq saved successfully"})
        } catch (error) {
            return res.status(400).json({status:400,message:error.message});
        }
    }
    getFaq = async(req,res) =>{
        try {
            const question = await FaqModel.find({ });
            
            return res.status(200).json({status:200,faq:question})
        } catch (error) {
            return res.status(400).json({status:400,message:error.message});
        }
    }
    editFaq = async(req,res) =>{
        try {
            const { id } = req.params;
            const { title,description } = req.body;

            const questionAsked = await FaqModel.findOne({_id:id });

            if(!questionAsked) {
                throw new ErrHandle(404,"Faq not found")
            }

            const question = await FaqModel.findOneAndUpdate({ _id:id},{
                $set:{
                    title,
                    description
                }
            },{ new:true });

            if(!question) {
                throw new ErrHandle(404,"Faq not found")
            }

            return res.status(200).json({status:200,message:"Faq updated !"})
        } catch (error) {
            return res.status(400).json({status:400,message:error.message});
        }
    }
    deleteFaq = async(req,res) =>{
        try {
            const { id } = req.params;

            const questionAsked = await FaqModel.findOne({ _id:id });

            if(!questionAsked) {
                throw new ErrHandle(404,"Faq not found")
            }

            const question = await FaqModel.findByIdAndUpdate(questionAsked._id,{
                $set:{
                    status:"disable"
                }
            },{ new:true });
            
            return res.status(200).json({status:200,message:"Faq removed !"})
        } catch (error) {
            return res.status(400).json({status:400,message:error.message});
        }
    }
}

const faq = new Faq();
export { faq };
