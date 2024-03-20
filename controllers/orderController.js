import Order from '../models/orderModel.js';
export const orderController = async (req , res)=>{

    try {

        const orderDate = new Date(); 
        const formattedOrderDate = `${orderDate.getDate().toString().padStart(2, '0')}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}-${orderDate.getFullYear()}`;
        console.log("date", formattedOrderDate )
        const { user, products} = req.body;
        if(!orderDate || !user || !products){
            return res.status(400).send({
                success : false,
                message : "All fields are required"
            })
        }
        const order = new Order({
            orderDate:formattedOrderDate,
            user,
            products
        });
        await order.save();
        return res.status(200).send({
            success : true,
            message : "Order Placed Successfully",
            order
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success : false,
            message : "Error while placing order",
            error
        })
    }

}

export const getorderController = async (req , res)=>{
    try {

        const { userid } = req.params;
        if(!userid){
            return res.status(400).send({
                success : false,
                message : "userid is required"
            })
        }
        const orderDetails = await Order.find({ user: userid})
        .populate({
            path : 'user',
            select : '-password -question -role',
        })
        .populate({
            path : 'products',
            select : '-photo'
        });
        
        return res.status(200).send({
            success : true,
            message : "Order Details",
            orderDetails

        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success : false,
            message : "Error while fetching orders",
            error
        })
    }
}