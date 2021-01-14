import express from 'express'
const router = express.Router()
import {
    addOrderItems,
    getMyOrders,
    getOrderById,
    getOrders,
    updateOrderToPaid, updateOrderToDelivered, updateOrderAbsen
} from "../controllers/orderController.js";
import {protect, admins} from "../middleware/authMiddleware.js";

router.route('/').post(protect, addOrderItems).get(protect, admins, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/delivered').put(protect,admins, updateOrderToDelivered)
router.route('/:id/absens').put(protect, updateOrderAbsen)


export default router