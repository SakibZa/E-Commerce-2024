import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/auth.js';
const router = express.Router();
import { createCategoryController , updateCategoryController, getCategoriesController, singleCategoryController, deleteCategory} from '../controllers/categoryController.js';

// Add routes

router.post('/create-category' ,[requireSignIn , isAdmin], createCategoryController)

//update Category

router.put('/update-category/:id' , [requireSignIn , isAdmin] , updateCategoryController);

//get All category
router.get('/get-categories' , getCategoriesController)

//single category

router.get('/single-category/:slug' , singleCategoryController )


//delete Category
router.delete('/delete-category/:id',[requireSignIn, isAdmin], deleteCategory)
export default router