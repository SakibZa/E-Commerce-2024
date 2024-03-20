import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController = async (req, res)=>{
    try{

        const {name} = req.body;
        if(!name){
            return res.status(401).send({
                message:"Name is required"
            })
        }
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(409).send({
                success: false,
                message: 'Category Already Exists',
            })
        }

        const category = await new categoryModel({
            name,
            slug:slugify(name)
        }).save();

        return res.status(201).send({
            success:true,
            message: 'Category created successfully',
            category
        })
    }catch(err){
        console.log(err);
        return res.status(500).send({
            success: false,
            message: 'Error while creating category',
        })
    }
}

export const updateCategoryController = async (req, res)=>{

    try{

        const {name} = req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(id,{
            name,
            slug:slugify(name)
        },{
            new:true
        })

        return res.status(200).send({
            success: true,
            message: 'Category updated successfully',
            category
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            success: false,
            message: 'Error while updating category',
        })
    }
}

export const getCategoriesController = async (req, res)=>{

    try{

        const categories = await categoryModel.find({})
        if(!categories){
            return res.status(404).send({
                success: false,
                message: "No Categories Found"
            })
        }
        return res.status(200).send({
            success: true,
            message: "All Categories",
            categories
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error while getting category",
            error: err
        })
    }
}

export const singleCategoryController = async(req, res)=>{
    try{

        const { slug } = req.params;
        const category = await categoryModel.findOne({slug});
        if(!category){
            return res.status(401).send({
                success: false,
                message: "No Category Found"
            })
        }
        return res.status(200).send({
            success: true,
            message: "Single Category Fetched",
            category
        })
    }catch(err){
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Error while getting category",
            error: err
        })
    }
}

export const deleteCategory = async(req, res)=>{
    
    try {

        const { id } = req.params;
        const category = await categoryModel.findByIdAndDelete(id);

        return res.status(200).send({
            success: true,
            message: "Category Deleted Successfully",
        })
        
    } catch (error) {
        console.log(error);
        return res.staus(500).send({
            success: false,
            message: "Error while deleting category",
            error
        })
    }
}