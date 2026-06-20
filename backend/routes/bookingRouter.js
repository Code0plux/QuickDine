import express from 'express'
import { authenticateUser } from '../middleware/authMiddleware.js'
import {bookRestaurant, cancelBooking, getUserBooking} from '../controllers/bookings.js'
import isRestaurantOwner from '../middleware/isRestaurantOwner.js'
import { getRestaurant } from '../controllers/restaurantController.js'
const router = express.Router()

router.route('/').post(authenticateUser,bookRestaurant)
router.route('/my').get(authenticateUser,getUserBooking)
router.route('/my/cancel/:id').patch(authenticateUser,cancelBooking)

export default router;