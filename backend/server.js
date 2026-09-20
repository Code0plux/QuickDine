import 'dotenv/config'
import express from 'express';
import db from './config/db.js';
import authRouter from './routes/authRouter.js'
import bookingRouter from './routes/bookingRouter.js'
import restaurantRouter from './routes/restaurantRouter.js'
import userRouter from './routes/userRouter.js'
import cors from 'cors'
const app = express();
app.use(cors())
app.use(express.json());
app.use('/restaurants',restaurantRouter)
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/bookings',bookingRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));