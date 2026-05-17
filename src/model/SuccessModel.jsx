import { CheckCircle } from 'lucide-react';
import React from 'react';
  import {useNavigate} from "react-router-dom"



const SuccessModel = () => {


     const navigate = useNavigate()


      const handleNavigate=()=>{
 
          navigate("/showuserappoinment")
     
 }
  return (
    <div className="flex flex-col items-center justify-center w-full h-72 bg-white border border-green-100 rounded-xl shadow-sm text-center">
      <CheckCircle className="text-green-500 mb-2" size={40} />
      <h2 className="text-lg font-semibold text-green-700">Appointment Request Sent</h2>
      <p className="text-sm text-gray-600 mt-2 max-w-md">
        Your appointment has been successfully created and is pending admin approval. You’ll be notified once it’s confirmed.
      </p>
      <button
        onClick={ handleNavigate}
        className="mt-4 text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
      >
        Go Back
      </button>
    </div>
  );
};

export default SuccessModel;
