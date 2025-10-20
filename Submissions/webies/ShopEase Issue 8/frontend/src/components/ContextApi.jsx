import { createContext, useState,useEffect, use } from "react";


export const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
  


   const [products,setProducts]=useState([])
   const [sales,setSales]=useState([])    
   
     
    useEffect(()=>{
         fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sales`,{
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      })
         .then((res)=> res.json())
         .then((data)=> setSales(data))
         .catch((err)=>console.log(err))
    },[])

 useEffect(() => {
       fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`,{
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err))
  }, [])

 
  return (
    <ContextApi.Provider value={{ products,setProducts,sales,
   setSales,}}>
      {children}
    </ContextApi.Provider>
  );
};
