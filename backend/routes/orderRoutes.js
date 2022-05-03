import express from 'express'
import Order from '../models/orderModel.js'
const router = express.Router()
import { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered} from '../controllers/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(protect,addOrderItems).get(protect, admin, getOrders)
router.route('/myorders').get(protect,getMyOrders)
router.route('/:id').get(protect,getOrderById)
router.route('/:id/deliver').put(protect,admin, updateOrderToDelivered)

router.put('/pay/:id',async(req,res)=>{
    console.log(req.params.id);
    console.log(req.body);
    const order = await Order.findById(req.params.id)
    //populate is used to get users info through order id
    if(order){
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: "Paid", 
            update_time: req.body.updatedAt,
            email_address: req.body.user.email
     }
     const updatedOrder = await order.save(); //saving order (is paid) to the database
    return res.status(200).json(updatedOrder);

    }else{
        res.status(404)
        throw new Error('Order Not Found')
    }
});

export default router