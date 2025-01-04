import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userModel from "../modals/userModel.js"
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../modals/doctorModel.js"
import appointmentModel from "../modals/appointmentModel.js"
//api to register user

const registerUser=async(req,res)=>{
    try {
        const {name,email,password}=req.body
       
        if(!name || !password ||!email){
            return res.json({success:false,message:"Missing Details"})
        }
        //validate email
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"enter a valid email"})
        }
        if(password.length < 8){
            return res.json({success:false,message:"enter a strong password"})
        }

        //hashing user passsword
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const userData={
            name,
            email,
            password:hashedPassword
        }
        const newUser = new userModel(userData)
        const user= await newUser.save()

        //generate tokenJWT_SECRET
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.json({success:true,token})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api for user login
const loginUser=async(req,res)=>{
    try {
        const {email,password} = req.body
        const user = await userModel.findOne({email})

        if(!user){
          return  res.json({success:false,message:"User does not exist"})
        }

        const isMatch=await bcrypt.compare(password,user.password)
        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invailid credentials"})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
//api to get user profile data
const getProfile = async(req,res)=>{
    try {
        const {userId}=req.body
        const userData = await userModel.findById(userId).select("-password")
        res.json({success:true,userData})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to update user profile
const updateProfile=async(req,res)=>{
    try {
        const {userId,name,phone,address,dob,gender}=req.body
        const imageFile=req.file
        if(!name ||!phone ||!dob||!gender){
            return res.json({success:false,message:"Data Missing"})
        }
        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
        if(imageFile){
            //upload image to coudinary
            const imageUpload= await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
            const imageUrl = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageUrl})

        }
        res.json({success:true,message:"profile Updated"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to book appointment
const bookAppointment=async(req,res)=>{
    try {
       const {userId,docId,slotDate,slotTime}=req.body
       
       const docData = await doctorModel.findById(docId).select("-password")

       if(!docData.available){
        return res.json({
            success:false,message:"Doctor Not Available"
        })
       }

    
   
 
       let slot_booked = docData.slot_booked
 
       //checking for slots availability
      
       if(slot_booked[slotDate]){
       
        if(slot_booked[slotDate].includes(slotTime)){
            console.log(slot_booked)
            return res.json({success:false,message:"slot not available"})
        }else{
            slot_booked[slotDate].push(slotTime)
        }
       }else{
        slot_booked[slotDate]=[]
        slot_booked[slotDate].push(slotTime)
       }
       const userData= await userModel.findById(userId).select("-password")
       delete docData.slot_booked
       const appointmentData={
        userId,
        docId,
        userData,
        docData,
        amount:docData.fees,
        slotTime,
        slotDate,
        date:Date.now()
       }
        
       const newAppointment=new appointmentModel(appointmentData)
       await newAppointment.save()
       //save new slots data in docData
       await doctorModel.findByIdAndUpdate(docId,{slot_booked})

       res.json({success:true,message:"Appointment Booked"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to get user appointment for frontend my-appointment-page
const listAppointment=async(req,res)=>{
try {
    const {userId}=req.body
    const appointments=await appointmentModel.find({userId})
    res.json({success:true,appointments})
    
} catch (error) {
    console.log(error)
        res.json({success:false,message:error.message}) 
}
}
//api to cancel appointment
const cancelAppointment=async(req,res)=>{
    try {
        const {userId,appointmentId}=req.body

        const appointmentData=await appointmentModel.findById(appointmentId)
//varify appointment user
        if(appointmentData.userId!==userId){
            return res.json({success:false,message:"Unauthorized Action "})
        }
        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        //releasing doctor slot
        const {docId,slotDate,slotTime}=appointmentData
        const doctorData = await doctorModel.findById(docId)
        let slot_booked=doctorData.slot_booked
        slot_booked[slotDate]=slot_booked[slotDate].filter(e=>e!==slotTime)
        await doctorModel.findByIdAndUpdate(docId,{slot_booked})
        res.json({success:true,message:"Appointment Canelled"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to delete history of appointments
const deleteAppointmentHistory=async(req,res)=>{
    try {
        const {userId,appointmentId}=req.body
        const appointmentData=await appointmentModel.findById(appointmentId)
        if(appointmentData.userId!==userId){
            return res.json({success:false,message:"Unauthorized Action "})
        }
        await appointmentModel.findByIdAndDelete(appointmentId)
   
        res.json({success:true,message:"Appointment history deleted"})
    } catch (error) {
            console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,deleteAppointmentHistory}