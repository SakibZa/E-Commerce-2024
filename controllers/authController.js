import { comparePassword, hashPassword } from '../helper/authHelper.js';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
export const registerController = async (req, res) =>{

    try{

        const {name , email , password , phone , address, question} = req.body; 
         //Validations
         if(!name){
            return res.send({error : 'Name is required'});
         }
         if(!email){
            return res.send({error : 'Email is required'});
         }
         if(!password){
            return res.send({error : 'Password is required'});
         }
         if(!phone){
            return res.send({error : 'Phone is required'});
         }
         if(!address){
            return res.send({error : 'address is required'});
         }
         if(!question){
            return res.send({error : 'question is required'});
         }

         //existing user

         const existinguser = await userModel.findOne({email })
         if(existinguser){
            return res.status(200).send({
                success : true,
                message : 'User already exists please Login',
                existinguser: existinguser
            })
         }

         //register User

         const hashedPassword = await hashPassword(password);

         const user = await new userModel({ name, email, phone , address,question, password:hashedPassword}).save();
         console.log("user" , user)
         return res.status(201).send(({
            success: true,
            message : 'User Registered Successfully',
            user : user
         }))
      
    }catch(err){
        console.log(err)
        res.status(500).send({
            success : false,
            message: 'Error in Registrtion',
            err
        })
    }

} 
export const loginController = async(req, res)=>{

    try{

        const {email , password} = req.body;
        if(!email || !password){
            return res.status(404).send({
                success: false,
                message: "Invalid email or password"
            })
        }
        const user = await userModel.findOne({email});
        
        if(!user){
            return res.status(404).send({
                success: false,
                message: "Email is not registered"
            })
        }
        if(await comparePassword(password , user.password)){

            const token = await jwt.sign({_id: user._id}, process.env.SECRET_KEY , {
                expiresIn: '7d'
            })

            return res.status(200).send({
                success: true,
                message: "login successfully",
                user:{
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    role: user.role,
                    id: user._id
                    
                },
                token
            })
        }
        else{
            return res.status(404).send({
                success: false,
                message: "Invalid password"
            })  
        }
         
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in login",
            error
        })
    }
}

export const forgotPasswordController = async(req, res)=>{
    try{

        const {email , question, newPassword} = req.body;
        if(!email){
            return res.status(404).send({
                success: false,
                message: "Email is required"
            })
        }
        if(!question){
            return res.status(404).send({
                success: false,
                message: "Security Question is required"
            })
        }
        if(!newPassword){
            return res.status(404).send({
                success: false,
                message: "New Password is required"
            })
        }

        //check email 
        const user = await userModel.findOne({email, question});
        if(!user){
            return res.status(404).send({
                success: false,
                message: "Wrong Email or Security Question"
            })
        }

        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, {password: hashed})
        return res.status(200).send({
            success: true,
            message: "Password Reset Successfully"
        })
    }catch(err){
      
        console.log(err);
        return res.status(500).send({
            success: false,
            message: "Something Went wrong",
            error: err
        })
    }


}

export const updateUserController = async(req, res)=>{
    try {
        
        const { id } = req.params;
        const user = await userModel.findById(id);
       
        if (user) {
            const { name,  phone, address, password } = req.body;
            const hashedPassword = await hashPassword(password);
            const updateUser = await userModel.findByIdAndUpdate(id,{
                name: name || user.name,
                phone: phone || user.phone,
                address: address || user.address,
                password: hashedPassword || user.password
            },{new : true})
            return res.status(201).send({
                success: true,
                message: "User Updated Successfully",
                name: updateUser.name,
                email: updateUser.email,
                phone: updateUser.phone,
                address: updateUser.address
            })
        }
        else{
            return res.status(404).send({
                success: false,
                message: "User not found"
            })
        }

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            message: "Error while update user",
            err
        })
    }
}
