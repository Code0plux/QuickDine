import express from 'express';
import authcontroller from '../controllers/auth.js';
import validate from '../middleware/validate.js';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '../middleware/authSchemas.js';
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { message: 'Too many login attempts, try again after 15 minutes' } });

const router = express.Router();
router.post('/login', loginLimiter, validate(loginSchema), authcontroller.login);
router.post('/register',        validate(registerSchema),       authcontroller.register);
router.post('/forgot-password', validate(forgotPasswordSchema), authcontroller.forgotPassword);
router.post('/reset-password',  validate(resetPasswordSchema),  authcontroller.resetPassword);

export default router;
