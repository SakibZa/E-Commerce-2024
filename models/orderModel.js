import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({

    orderDate:{
        type:String,
        require:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    }]
},{
    timestamps: true
});
export default mongoose.model("Order", orderSchema)