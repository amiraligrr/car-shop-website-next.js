// pages/cars/index.js
import React from 'react';
import Card from '@/componnets/card'; // دقت کن: componnets -> components
import { useData } from '@/context/data';

const CarsPage = () => {
  const { cars, loading, error } = useData();

 if (loading){ return(<div className="min-h-screen  flex items-center justify-center">
            <div className="text-center">
                <h1 className='text-white text-2xl mb-4'>در حال گرفتن اطلاعات از سرور</h1>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            </div>
        </div>);}
  
  if (error) return (
    <div className="text-red-600 text-center p-4">
      خطا: {error}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-200">
        لیست خودروها
      </h1>
      
      {cars.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          هیچ خودرویی یافت نشد
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <Card 
            
              key={car.id}
              id={car.id} // مهم: id رو هم پاس بده
              brandpic={car.brandpic}
              title={car.model || car.title} 
              img={car.image || car.img}
              price={car.price}
              brand={car.brand}
              year={car.year}
              km={car.km || car.mileage} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarsPage;