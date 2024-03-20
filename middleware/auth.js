import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
export const requireSignIn = async( req, res, next) =>{

   try{
 
    const token = req.headers["x-access-token"]||req.body.token || req.query.token; 
    const decode = jwt.verify(token, process.env.SECRET_KEY )
      
      req.user = decode
    next();
   }catch(error){
    console.log(error);
    return res.status(500).send({
        success: false,
        message: "Error in token",
        error: error
    })
   }
}

//adminAccess

export const isAdmin = async (req, res, next)=>{
    try{

        const user = await userModel.findById(req.user._id);
        if(user.role!==1){

            return res.status(401).send({
                success : false,
                message : "unauthorized Access"

            })
        }
        else{
            next();
        }
    }catch(error){
        return res.status(500).send({
            success: false,
            message: "You are not admin",
            error: error
        }) 
    }
}