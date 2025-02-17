import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500 '>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>
      <div className='flex flex-col md:flex-row my-10 justify-center gap-10 mb-20 text-sm'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
    
      <div className='flex flex-col justify-center  gap-6 '>
        <p className='font-semibold text-lg text-gray-600'>Our OFFICE</p>
        <p className='text-gray-500'> 54709 Shivranjani 
          <br/> cloud-9 ,Ahmedabad,INDIA
        </p>
        <p className='text-gray-500'>Tel:(102) 123-0234 <br /> kunalgwala8696@gmail.com</p>
        <p className='font-semibold text-lg text-gray-600'>Carrer At PRISCRIPTO</p>
        <p className='text-gray-500'>Learn More About Our Teams And Job Opening</p>
        <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-300'>Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}

export default Contact