// context/data.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userdata, setUserdata] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
   
    setIsClient(true);
    
 
    const fetchData = async () => {
      try {
        setLoading(true);
        
      
        const carsRes = await axios.get('http://localhost:3001/cars');
        setCars(carsRes.data);
        
        
        const token = Cookies.get('token');
        if (token) {
          const userRes = await axios.get(
            `http://localhost:3001/users?id=${encodeURIComponent(token)}`
          );
          if (userRes.data && userRes.data.length > 0) {
            setUserdata(userRes.data[0]);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []); 
  const loadingState = isClient ? loading : false;

  const value = {
    setUserdata,
    cars,
    loading: loadingState, 
    error,
    userdata: isClient ? userdata : null, 
    isClient 
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};