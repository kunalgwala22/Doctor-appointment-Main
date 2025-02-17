import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router'
import { AppContext } from '../context/AppContext'
import axios from 'axios'

const ResetPassword = () => {
  const navigate=useNavigate()
  const [email,setEmail]=useState('')
  const [newPassword,setNewPassword]=useState('')
  const [isEmailSent,setIsEmailSent]=useState('')
  const [otp,setOtp]=useState(0)
  const [isOtpSubmited,setIsOtpSubmited]=useState(false)
  const {backendUrl}=useContext(AppContext)
  axios.defaults.withCredentials =true;

  const inputRefs=React.useRef([])
    const handleInput=(e,index)=>{
      if(e.target.value.length >0 && index<inputRefs.current.length -1){
        inputRefs.current[index+1].focus()
      }
    }
    const handleKeyDown=(e,index)=>{
      if(e.key==='Backspace' && e.target.value==='' && index >0){
        inputRefs.current[index-1].focus()
      }
    }
    const handlePaste=(e)=>{
      const paste =e.clipboardData.getData('text')
      const pasteArray=paste.split('');
      pasteArray.forEach((char,index) => {
        if(inputRefs.current[index]){
          inputRefs.current[index].value=char;
        }
        
      });
    }

const onSubmitEmail=async(e)=>{
  e.preventDefault()
  try {
    const {data}=await axios.post(backendUrl+'/api/user/sent-reset-otp',{email})
    data.success?alert(data.message):console.log(data.message)
    data.success && setIsEmailSent(true)
  } catch (error) {
    console.log(error.message)
  }
}

const onSubmitOtp=async(e)=>{
  e.preventDefault()
  const otpArray=inputRefs.current.map(e=>e.value)
  setOtp(otpArray.join(''))
  setIsOtpSubmited(true)
 
}
const onSubmitNewPassword=async(e)=>{
  e.preventDefault()
  try {
    const {data}=await axios.post(backendUrl+"/api/user/reset-password",{email,otp,newPassword})
    data.success?alert(data.message) :console.log(data.message)
    data.success && navigate('/login')

  } catch (error) {
    conaole.log(error.message)
  }
}
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
     
            {!isEmailSent && <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm '>
        <h1 className='text-white text-2xl font-semibold text-center mb-4 '>Reset Password</h1>
        <p className='text-center mb-6 text-indigo-300 '>Enter Your Registered Email Address</p>
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img className='w-3 h-3' src={assets.mail_icon} alt="" />
          <input type="email" placeholder='Email Id' className='bg-transparent outline-none text-white' value={email} onChange={e=>setEmail(e.target.value)} required/>
        </div>
        <button  className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Submit</button>

        </form>}
        
       
{
  !isOtpSubmited &&  isEmailSent && <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm ' >
  <h1 className='text-white text-2xl font-semibold text-center mb-4 '>Reset Password Otp</h1>
  <p className='text-center mb-6 text-indigo-300 '>Enter  the 6-digit code sent to your email</p>
  <div className='flex justify-between mb-6' onPaste={handlePaste}>
    {Array(6).fill(0).map((_,index)=>(
      <input type="text" key={index} maxLength='1' required  className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
       ref={e=>inputRefs.current[index]=e}  
       onInput={(e)=>handleInput(e,index)}
       onKeyDown={(e)=>handleKeyDown(e,index)}
       />
    ))}
  </div>
  <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500  to-indigo-900  text-white rounded-full'>Submit</button>

</form>
}
        
      {
        isOtpSubmited && isEmailSent && <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm '>
        <h1 className='text-white text-2xl font-semibold text-center mb-4 '>new Password</h1>
        <p className='text-center mb-6 text-indigo-300 '>Enter new Password</p>
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
          <img className='w-3 h-3' src={assets.lock_icon} alt="" />
          <input type="password" placeholder='Password' className='bg-transparent outline-none text-white' value={newPassword} onChange={e=>setNewPassword(e.target.value)} required/>
        </div>
        <button  className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Submit</button>

        </form>
      }
      
      </div>
  )
}

export default ResetPassword