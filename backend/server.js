import express from 'express';
import db from './config/db.js';
import userRouter from './routes/userRouter.js'
import 'dotenv/config'
import authRouter from './routes/authRouter.js'
import bookingRouter from './routes/bookingRouter.js'
import restaurantRouter from './routes/restaurantRouter.js'
const app = express();
app.use(express.json());
app.use('/restaurants',restaurantRouter)
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/bookings',bookingRouter)

app.listen(3000, () => console.log('Server running on port 3000'));