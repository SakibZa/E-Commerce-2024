import express from "express";
import { registerController , loginController ,forgotPasswordController, updateUserController} from '../controllers/authController.js';
import { requireSignIn ,isAdmin} from '../middleware/auth.js';
const router = express.Router();

//register
router.post('/register' , registerController)

//login
router.post('/login' , loginController)

//forgot-passowrd

router.post('/forgot-password' , forgotPasswordController)

//update User

router.put('/update-user/:id', [requireSignIn] , updateUserController )
//test 
router.get('/protected' , requireSignIn , (req, res)=>{
    res.status(200).send({
        ok:true
    })
})

//user Admin Check
router.get('/admin-auth' , [requireSignIn , isAdmin] , (req, res)=>{
    res.status(200).send({
        ok:true
    })
})

export default router;
