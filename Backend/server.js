import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoutes.js'
import doctorRouter from './routes/doctorRoutes.js'
import userRouter from './routes/userRoutes.js'


//app config
const app = express()
connectDB()
connectCloudinary()
const port=process.env.PORT || 4000


//middlewares
app.use(express.json())
const allowedOrigins=['https://doctor-appointment-main-gamma.vercel.app','https://doctor-appointment-main-1gdv.vercel.app']
app.use(cors({origin:allowedOrigins ,credentials:true}));

//api endpoints 
app.use("/api/admin",adminRouter)
//localhost:4000/api/admin/add-doctor
app.use("/api/doctor",doctorRouter)

app.use("/api/user",userRouter)

app.get('/',(req,res)=>{
   res.send('API WORKING')
})

app.listen(port,()=>{
    console.log('Server started ',port)
})
