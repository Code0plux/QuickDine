import express from 'express'
import authcontroller from '../controllers/auth.js'
import { authenticateUser } from '../middleware/authMiddleware.js'
const router = express.Router()

router.route('/login').post(authcontroller.login)
router.route('/register').post(authcontroller.register)
router.route('/forgot-password').post(authcontroller.forgotPassword)
router.route('/reset-password').post(authcontroller.resetPassword)

export default router;