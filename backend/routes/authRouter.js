import express from 'express';
import authcontroller from '../controllers/auth.js';
import validate from '../middleware/validate.js';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '../middleware/authSchemas.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();
router.post('/login',rateLimit,   validate(loginSchema),          authcontroller.login);
router.post('/register',        validate(registerSchema),       authcontroller.register);
router.post('/forgot-password', validate(forgotPasswordSchema), authcontroller.forgotPassword);
router.post('/reset-password',  validate(resetPasswordSchema),  authcontroller.resetPassword);

export default router;
