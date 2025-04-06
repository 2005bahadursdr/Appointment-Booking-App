import { createContext, useState, useEffect } from "react";

import axios from 'axios'
import {toast} from 'react-toastify'

export const AdminContext = createContext()


const AdminContextProvider = (props) =>{
    const [aToken , setAToken]=useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const backendUrl =import.meta.env.VITE_BACKEND_URL

    const [doctors,setDoctors]=useState([])

    const [appointments, setAppointments]=useState([])
    const [dashData , setDashData] =useState(false)

      // Update localStorage whenever aToken changes
      useEffect(() => {
        if (aToken) {
            localStorage.setItem('aToken', aToken);
        } else {
            localStorage.removeItem('aToken'); // Remove token if it's cleared
        }
    }, [aToken]);


    const getAllDoctors = async() =>{
        try {

            const{data} =await axios.post(backendUrl + '/api/admin/all-doctors',{},{headers:{aToken}})
            if (data.success) {
                setDoctors(data.doctors)
                console.log(data.doctors)
                
            }
            else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
            
        }

    }

    const changeAvailability=async (docId) =>{

        try {
            const {data}=await axios.post(backendUrl +'/api/admin/change-availability',{docId}, {headers:{aToken}})

            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
                
            }else{
                toast.error(data.message)
            }

            
        } catch (error) {
             toast.error(error.message)
        }
    }

    const getAllAppointments =  async () =>{
       try {

        const {data} =await axios.get(backendUrl+ '/api/admin/appointments',{headers:{aToken}})
        
        if (data.success) {
            setAppointments(data.appointments)
            
        }else{
            toast.error(data.message)
        }

       } catch (error) {
        toast.error(error.message)
       }

    }
    const cancelAppointments =async (appointmentId) => {
       try {
        const {data} = axios.post(backendUrl + '/api/admin/cancel-appointment' , {appointmentId} ,{headers:{aToken}})
        
        if(data.success){
            toast.success(data.success)

            getAllAppointments()
        }else{
          toast.error(data.message) 

        }
        res.json({success:true , message:"appointment is cancelled"})

       } catch (error) {
        toast.error(error.message)
        
       } 



    }



    const getDashData =async () =>{
        try {

            const {data}=await axios.get(backendUrl+'/api/admin/dashboard' , {headers:{aToken}})

            if(data.success){
                setDashData(data.dashData)
                console.log(data.dashData)
            }else{
                toast.error(data.message)
            }

            
            
        } catch (error) {

            toast.error(data.message)
        }
    }

    const value = {
        aToken,setAToken,
        backendUrl, doctors,
        getAllDoctors,changeAvailability,
        appointments,setAppointments,
        getAllAppointments,
        cancelAppointments,
        dashData,getDashData


    }
    return(
        <AdminContext.Provider value={value}>
            {props.children}

        </AdminContext.Provider>
    )
}
export default AdminContextProvider


// import { createContext, useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// export const AdminContext = createContext();

// const AdminContextProvider = ({ children }) => {
//     // Initialize token from localStorage or empty string
//     const [aToken, setAToken] = useState(() => localStorage.getItem("aToken") || "");
//     const backendUrl = import.meta.env.VITE_BACKEND_URL;

//     const [doctors, setDoctors] = useState([]);
//     const [appointments, setAppointments] = useState([]);

//     // Synchronize aToken with localStorage
//     useEffect(() => {
//         if (aToken) {
//             localStorage.setItem("aToken", aToken);
//         } else {
//             localStorage.removeItem("aToken");
//         }
//     }, [aToken]);

//     // Axios instance with token interceptor
//     const axiosInstance = axios.create({
//         baseURL: backendUrl,
//     });

//     axiosInstance.interceptors.request.use(
//         (config) => {
//             if (aToken) {
//                 config.headers.aToken = aToken; // Attach token to headers
//             }
//             return config;
//         },
//         (error) => Promise.reject(error)
//     );

//     // Fetch all doctors
//     const getAllDoctors = async () => {
//         try {
//             const { data } = await axiosInstance.post("/api/admin/all-doctors", {});
//             if (data.success) {
//                 setDoctors(data.doctors);
//                 console.log("Doctors fetched:", data.doctors);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Failed to fetch doctors.");
//             console.error(error);
//         }
//     };

//     // Change doctor's availability
//     const changeAvailability = async (docId) => {
//         try {
//             const { data } = await axiosInstance.post("/api/admin/change-availability", { docId });
//             if (data.success) {
//                 toast.success(data.message);
//                 getAllDoctors(); // Refresh doctors after updating availability
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Failed to change availability.");
//             console.error(error);
//         }
//     };

//     // Fetch all appointments
//     const getAllAppointments = async () => {
//         try {
//             const { data } = await axiosInstance.get("/api/admin/appointments");
//             if (data.success) {
//                 setAppointments(data.appointments);
                
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Failed to fetch appointments.");
//             console.error(error);
//         }
//     };

//     // Context value
//     const value = {
//         aToken,
//         setAToken,
//         backendUrl,
//         doctors,
//         getAllDoctors,
//         changeAvailability,
//         appointments,
//         setAppointments,
//         getAllAppointments,
//     };

//     return (
//         <AdminContext.Provider value={value}>
//             {children}
//         </AdminContext.Provider>
//     );
// };

// export default AdminContextProvider;

