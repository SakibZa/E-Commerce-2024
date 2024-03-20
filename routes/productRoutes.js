import express from "express";
import { isAdmin, requireSignIn } from "../middleware/auth.js";
const router = express.Router();
import {
  createProductController,
  getProductsController,
  getSingleProductsController,
  photoProductsController,
  deleteProductController,
  updateProductController,
  filterProductController,
  productCountController,
  getProductPerPageController,
  searchProductController
} from "../controllers/productController.js";
import formidable from "express-formidable";
//routes post

router.post(
  "/create-product",
  [requireSignIn, isAdmin, formidable()],
  createProductController
);

//router get

router.get("/get-product", getProductsController);

//single route

router.get("/get-product/:slug", getSingleProductsController);

//get phot

router.get("/product-photo/:pid", photoProductsController);

//delete product

router.delete(
  "/product-delete/:pid",
  [requireSignIn, isAdmin],
  deleteProductController
);

//update Product

router.put(
  "/update-product/:pid",
  [requireSignIn, isAdmin, formidable()],
  updateProductController
);

//filter Product

router.post("/filter-product", filterProductController);

//count Product

router.get("/product-count", productCountController);

//get product per page

router.get('/get-product-page/:page' , getProductPerPageController);

//search product 

router.get('/search/:keyword' , searchProductController);


export default router;
