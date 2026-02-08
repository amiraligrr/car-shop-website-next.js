import React from "react";
import Link from "next/link";

const Card = ({ title, img, price, brand, year, km, brandpic, id }) => {
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Link href={`/cars/${id}`} className="block shadow-green-500 shadow-xl">
      <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-green-500 cursor-pointer">
        
      
        <div className="relative h-56 overflow-hidden">
          <img 
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            src={img || "/default-car.jpg"}
            alt={title}
          />
          <div className="absolute top-3 right-3 bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full">
            {year}
          </div>
        </div>

   
        <div className="p-6">
          
      
          <div className="text-center mb-4">
            <h1 className="text-white text-2xl font-bold mb-2">
              {title}
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-green-700 mx-auto rounded-full"></div>
          </div>

       
          <div className="bg-gray-900 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-lg ">قیمت:</span>
              <div className="flex items-center">
                <span className="text-white text-2xl font-bold ml-2">
                  {formatNumber(price)}
                </span>
                <span className="text-gray-400 text-sm ml-7">تومان</span>
              </div>
            </div>
          </div>

     
          <div className="space-y-4">
            
        
            <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-3">
              <div className="flex items-center">
                <span className="text-gray-400">برند:</span>
              </div>
              <div className="flex items-center">
                 {brandpic && (
                  <img 
                    className="w-8 h-8 mr-3 object-contain"
                    src={brandpic}
                    alt={brand}
                  />
                )}
                <span className="text-white font-bold text-lg">
                  {brand}
                </span>
               
              </div>
            </div>

           
            {km && (
              <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-3">
                <div className="flex items-center">
                  <span className="text-gray-400 ml-2"></span>
                  <span className="text-gray-400">کارکرد:</span>
                </div>
                <span className="text-white font-bold">
                  {formatNumber(km)} کیلومتر
                </span>
              </div>
            )}

          </div>

          {/* دکمه */}
          <div className="flex gap-3 mt-6">
            <div className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 rounded-lg text-center">
              مشاهده جزئیات
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default Card;