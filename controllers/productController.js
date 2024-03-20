import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";
export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, category, quantity, shipping, price } =
      req.fields;
    const { photo } = req.files;
    //validationsS
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case !quantity:
        return res.status(500).send({ error: "quantity is required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is required and should be less than 1mb" });
    }

    const products = new productModel({
      ...req.fields,
      slug: slugify(name),
    });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();

    return res.status(200).send({
      success: true,
      message: "Product created successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while creating product",
      error,
    });
  }
};

export const getProductsController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .select("-photo")
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "All Products",
      products,
      total: products.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while getting products",
      error,
    });
  }
};

export const getSingleProductsController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    return res.status(200).send({
      success: true,
      message: "Single Product",
      product,
    });
  } catch (error) {
    consolr.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while getting products",
      error,
    });
  }
};

export const photoProductsController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while getting products",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel
      .findByIdAndDelete(req.params.pid)
      .select("-photo");
    return res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error: err,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    console.log(req.fields);
    const { name, slug, description, category, quantity, shipping, price } =
      req.fields;
    const { photo } = req.files;
    //validationsS
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !category:
        return res.status(500).send({ error: "category is required" });
      case !quantity:
        return res.status(500).send({ error: "quantity is required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is required and should be less than 1mb" });
    }
    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();

    return res.status(200).send({
      success: true,
      message: "Update Product successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while Updating product",
      error,
    });
  }
};

export const filterProductController = async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await productModel.find(args).select("-photo");
    return res.status(200).send({
      total: products.length,
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    return res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

export const getProductPerPageController = async (req, res) => {
  try {
    const page = req.params.page ? req.params.page : 1;

    const perPage = 3;

    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage);

    if (products) {
      return res.status(200).send({
        success: true,
        products,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

export const searchProductController = async (req, res)=>{
  try{
    const { keyword } = req.params;
    const products = await productModel.find({

      $or :[
        {name : {$regex : keyword , $options : "i"}},
        {description : {$regex : keyword , $options : "i"}},
      ]
       
    }).select("-photo")
    return res.status(200).send({
      success: true,
      products
    })

  }catch(err){
    consolr.log(err)
    return res.status(500).send({
      success: false,
      message: "Error while filtering products",
      error:err
    })
  }
}
