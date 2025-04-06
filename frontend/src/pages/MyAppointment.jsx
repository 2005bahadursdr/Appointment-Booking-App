import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import {useNavigate} from 'react-router-dom'


const MyAppointment = () => {
  const { backendUrl,token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('-')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]

  }
  const navigate =useNavigate();

  const getUserAppointments = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments);

      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)

    }

  }

  const cancelAppointment = async (appointmentId) => {
    try {
   
   const { data } = await axios.post(backendUrl +'/api/user/cancel-appointment', {appointmentId}, { headers:{token}})

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  };

// initlise razorpay

  const initPay = (order) =>{

    const options={

      key : import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:order.amount,
      currency:order.currency,
      name:'Appointment Payment',
      description:'Appointment payment',
      order_id:order.id,
      receipt:order.receipt,
     


      handler:async (response) => {
        console.log(response)

        // try {
        //   const {data} = await axios.post(backendUrl+'/api/user/verifyRazorpay', response,{headers:{token}})

        //   if (data.success) {
        //     getUserAppointments();
        //     navigate('/my-appointments')
            
        //   }
          
        // } catch (error) {
        //   console.log(error)
        //   toast.error(error.message)
        // }

        try {
          const { data } = await axios.post(backendUrl + '/api/user/verifyRazorpay', response, { headers: { token } });
        
          if (data.success) {
            getUserAppointments();
            navigate('/my-appointments');
          } else {
            toast.error(data.message || 'Verification failed');
          }
        } catch (error) {
          console.error('Error during verification:', error);
          if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            toast.error(error.response.data.message || 'An error occurred during verification');
          } else if (error.request) {
            // The request was made but no response was received
            console.error('Request data:', error.request);
            toast.error('No response received from the server');
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
            toast.error('An error occurred: ' + error.message);
          }
        }

      }


    }

    const rzp= new window.Razorpay(options)
    rzp.open();

  }

  //api for razorpay

  const appointmentRazorpay =async (appointmentId) =>{

    try {
      const {data} = await axios.post(backendUrl + '/api/user/payment-razorpay', {appointmentId}, {headers:{token}})
      
      if (data.success) {

       initPay(data.order)

       


       
        
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }


  }


  
  

  useEffect(() => {
    if (token) {

      getUserAppointments()

    }
  }, [token])

  



  
  const convertToRupees = (dollars, exchangeRate = 82.5) => dollars * exchangeRate;

  return (
    <div>
      <p className='pb-3 font-medium text-zinc-700  border-b '>My appointment</p>
      <div>
        {
          appointments.map((item, index) => (
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:gap-6 py-2 border-b' key={index}>
              <div>
                <img className='w-32 text-indigo-50' src={item.docData.image} alt="" />
              </div>
              <div className=' flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-800 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.docData.address.line1}</p>
                <p className='text-xs'>{item.docData.address.line2}</p>
                <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium  '>Date & Time :</span>{slotDateFormat(item.slotDate)}|{item.slotTime}</p>
                <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium  '>Appointment fee:</span>${item.docData.fees}</p>
              </div>

              <div></div>
              <div className='flex flex-col items-end gap-2 justify-end'>

                {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 '>Paid</button>}


               {!item.cancelled && !item.isCompleted && <button onClick={()=>appointmentRazorpay(item._id)} className='text-sm w-48 text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 '>Pay Online</button> } 
                {!item.cancelled && !item.isCompleted &&<button onClick={() => cancelAppointment(item._id)} className='text-sm w-48 text-store-500 text-center sm:min-w-48 py-2 border rounded  hover:bg-red-600 hover:text-white transition-all duration-300 '>Cancel Appointment</button>}
                {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 text-red-500'>Appoinment cancelled</button>}
                {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>}
              </div>


            </div>

          ))}

      </div>

    </div>
  )
}

export default MyAppointment
