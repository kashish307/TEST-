import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import colors from 'colors'
import morgan from 'morgan'
import cors from 'cors'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import  paymentRoutes from './routes/paymentRoutes.js'
//import Razorpay from 'razorpay'
//import shortid from 'shortid'

dotenv.config()

connectDB()

const app = express()
if(process.env.NODE_ENV === 'development')
{
    app.use(morgan('dev'))
}

// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_SECRET_ID
// })

// const whitelist = ["http://localhost:3000"]
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error("Not allowed by CORS"))
//     }
//   },
//   credentials: true,
// }

app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json({extended: false }));
app.get('/', (req,res) => {
    res.send('API is running....')
})

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/payment', paymentRoutes)

// app.get('/api/config/razorpay',(req,res) =>
// res.send(process.env.RAZORPAY_KEY_ID)
// )
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

//calling error middleware
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} MODE on port ${PORT}`.yellow.bold))