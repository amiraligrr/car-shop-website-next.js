// pages/index.js
import React from 'react';
import Card from '@/componnets/card';
import Link from 'next/link';

// این تابع در build-time اجرا می‌شود
export async function getStaticProps() {
  try {
    const res = await fetch('http://localhost:3001/cars');
    const cars = await res.json();
    
    return {
      props: {
        cars // داده مستقیماً به کامپوننت می‌رسد
      },
      revalidate: 60 // هر 60 ثانیه refresh شود
    };
  } catch (error) {
    return {
      props: {
        cars: []
      }
    };
  }
}

const Index = ({ cars }) => {
  // ❌ هیچ state، هیچ useEffect، هیچ loading!
  
  return (
    <div className=" min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-200">
          با ما واسطه را حذف کنید
        </h1>
        <hr className="border-gray-600 mb-8" />
        <h1 className="text-xl sm:text-3xl font-bold mb-8 text-center text-gray-200 mt-12">
          ماشین مورد نظرتون رو پیدا کنید و از فروشنده مستقیم بخرید
        </h1>
        
        {/* نمایش ماشین‌ها */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {cars.slice(0, 4).map((car) => (
            <Card 
              id={car.id}
              brandpic={car.brandpic}
              key={car.id}
              title={car.model || car.title}
              img={car.image || car.img}
              price={car.price}
              brand={car.brand}
              year={car.year}
              km={car.km || car.mileage} 
            />
          ))}
        </div>
        
        <hr className="border-gray-600 mb-8" />
        
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-200 mt-12 mb-8">
          اگهی بزارید و ماشینتون رو بفروشید
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.slice(4, 8).map((car) => (
            <Card 
              brandpic={car.brandpic}
              id={car.id}
              key={car.id}
              title={car.model || car.title}
              img={car.image || car.img}
              price={car.price}
              brand={car.brand}
              year={car.year}
              km={car.km || car.mileage} 
            />
          ))}
        </div>
        
        <Link href='/cars'>
          <div className="flex gap-3 w-50 text-sm sm:w-100 sm:text-2xl mt-10 mx-auto cursor-pointer">
            <div className="flex-1 bg-gradient-to-r from-green-600 to-green-700 shadow-sm shadow-green-400 hover:border-green-700 border-2 border-green-500 text-white font-bold py-3 rounded-lg text-center my-auto mx-auto">
              رفتن به صفحه ماشین ها
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Index;