import { useState,useEffect } from "react";
import { http } from "../axios/axios";
import { toast } from "react-toastify";
 import { useToast } from "../model/SuccessToasNotification";

export const useGetAllUser = () => {
  const [allUser, setAllUser] = useState([]);
   const {addToast}=useToast()

  const getAllUser = async () => {
    try {
      const response = await http.get("/getalluser");
      console.log("get all users", response);

      if (response.data?.success === true) {
   addToast(response.data.message,"success");
        setAllUser(response.data.data);
      } else {
        addToast(response.data.message,"error");
      }
    } catch (err) {
     addToast(err.message,"error");
    }
  };

   useEffect(()=>{
    getAllUser()
   },[])


  return { getAllUser, allUser };
};
