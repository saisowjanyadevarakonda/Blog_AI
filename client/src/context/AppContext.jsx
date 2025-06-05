import { useContext, useEffect } from "react";
import { createContext } from "react";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { useState } from "react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useUnmountEffect } from "motion/react";


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;






const AppContext = createContext();

export const AppProvider  = ({children}) => {
     const navigate = useNavigate();
     const [token,setToken] = useState(null);
     const [blogs,setBlogs] = useState([])
     const [input,setInput] = useState("")
    const [uToken,setUToken] = useState(null);
    const [user,setUser] = useState(null);

     const fetchBlogs = async() => {
        try {
          const {data} =   await axios.get('/api/blog/all');
          data.success?setBlogs(data.blogs) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
     }


 const fetchUserProfile = async(currentToken) => {
  if(!currentToken){
    setUser(null);
    return ;
  }
  try {
    const {data} = await axios.get('/api/user/get-profile',{
      headers:{'Authorization' : `Bearer ${currentToken}`}
    });
    if(data.success){
      setUser(data.userData)
    }
    else{
      setUser(null);
      toast.error(data.message)
    }
  } catch (error) {
    setUser(null);
    toast.error(error.message)
  }
 }

     useEffect(() => {
      fetchBlogs() ;
      const token = localStorage.getItem('token');
      // console.log('Loaded token: ' , token);
        setToken(token);
        if(token){
       
        axios.defaults.headers.common['Authorization'] = `${token}`;
      }
        
        const uToken = localStorage.getItem('uToken');
        // console.log('loaded user token' , uToken);
        setUToken(uToken);
        if(uToken){
          // axios.defaults.headers.common['Authorization'] = `${uToken}`;
          fetchUserProfile(uToken);
        }
        else{
          setUser(null);
        }
      
     },[])

    const value = {axios,navigate,token,setToken,blogs,setBlogs,input,setInput,uToken,setUToken,user, setUser}
    
    return(
        <AppContext.Provider value={value} >
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => {
    return useContext(AppContext)
};

