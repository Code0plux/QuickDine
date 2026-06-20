import express from 'express'
import authcontroller from '../controllers/auth.js'
import { authenticateUser } from '../middleware/authMiddleware.js'
//import { bookingController } from '../controllers/bookings.js'
const router = express.Router()

router.route('/login').post(authcontroller.login)
router.route('/register').post(authcontroller.register)
//router.route('/bookings').get(authenticateUser,bookingController)

export default router;