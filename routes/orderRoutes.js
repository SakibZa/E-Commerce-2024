import express from 'express';
import { isAdmin, requireSignIn } from '../middleware/auth.js';
import { orderController , getorderController} from '../controllers/orderController.js';
const router = express.Router();

router.post('/place-order' , [requireSignIn] , orderController);

router.get('/order-details/:userid' , [requireSignIn] , getorderController);




export default router;