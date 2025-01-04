import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Doctors from './pages/Doctors'
import Contact from './pages/Contact'
import Login from './pages/Login'
import About from './pages/About'
import MyProfile from './pages/MyProfile'
import MyAppointment from './pages/MyAppointment'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const App = () => {
  return (
  <>
  
    <div className='mx-4 sm:mx-[10%]'></div>
    <ToastContainer />
    <Navbar />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/doctors' element={<Doctors />} />
      <Route path='/doctors/:speciality' element={<Doctors />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/about' element={<About />} />
      <Route path='/login' element={<Login   />} />
      <Route path='/my-profile' element={<MyProfile />} />
      <Route path='/my-appointment' element={<MyAppointment />} />
      <Route path='/appointment/:docId' element={<Appointment />} />
    </Routes>
    <Footer />
  </>
  )
}

export default App
