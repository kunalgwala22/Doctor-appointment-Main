

//api for doctor
import bcrypt from "bcrypt"
import validator from "validator"
    import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../modals/doctorModel.js"
import jwt from "jsonwebtoken"


const  addDoctor = async(req,res)=>{
    try {

        const {name,email,password,speciality,degree,available,experience,about,fees,address} =req.body
        
        const imageFile = req.file

        //CHECKING for all data to add
        
        if(!name || !email || !password || !speciality || !degree ||!experience || !about ||!fees){
            return res.json({
                success:false,
                message:'Missing Details'
            })
        }
             //email format  validation
             if(!validator.isEmail(email)){
                return res.json({
                    seccess:false,
                    message:'please enter a valid email'
                })
            }
          

            if(password.legnth<8){
                return res.json({
                    seccess:false,
                    message:'please enter a strong password'
                })
            }

     //hashing doctor password 
     const salt = await bcrypt.genSalt(10)
     const hashedPassword = await bcrypt.hash(password,salt)

     //upload image to cloudinary
   const imageUpload = await cloudinary.uploader.upload(imageFile.path , {resourse_type:"image"})
   const imageUrl=imageUpload.secure_url

   const doctorData = {
    name,
    email,
    image:imageUrl,
    password:hashedPassword,
    speciality,
    degree,
    experience,
    available,
    about,
    fees,
    address:JSON.parse(address),
    date:Date.now()
   }

   const newDoctor = new doctorModel(doctorData)
   await newDoctor.save()
   res.json({success:true,message:"Doctor Added"})
      
    } catch (error) {
        // console.log(error)
        res.json({success:false,message:error.message})
    }
    
}

const loginAdmin =async(req,res)=>{
    try {
        const {email,password}=req.body

        if(email===process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token=jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({
                success:true,
                token
            })
        }else{
            res.json({success:false,message:"Invailid credintials"})
        }
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

//api to get all doctors list admin panel
const allDoctors = async(req,res)=>{
    try {
        const doctors= await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

export {addDoctor,loginAdmin,allDoctors}  
