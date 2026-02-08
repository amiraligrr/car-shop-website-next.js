import React, { useState, useEffect } from 'react';
import { useData } from '@/context/data';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Card from '@/componnets/card';

const ProfilePage = () => {
    const router = useRouter();
    const { userdata ,setUserdata} = useData();
    const [role, setRole] = useState('در حال بارگذاری...');
    const [formattedDate, setFormattedDate] = useState('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        
        const token = Cookies.get('token');
        if (!token) {
            router.push('/auth');
            return;
        }

   
        if (userdata) {
      
            if (userdata.role === 'admin') {
                setRole('ادمین');
            } else if (userdata.role === 'user') {
                setRole('کاربر عادی');
            }

          
            if (userdata.createdAt) {
                try {
                    const date = new Date(userdata.createdAt);
                    const persianDate = date.toLocaleDateString('fa-IR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    setFormattedDate(persianDate);
                } catch (error) {
                    setFormattedDate(userdata.createdAt);
                }
            }
        }
    }, [router, userdata]);


    if (!isClient || !userdata) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white text-xl">در حال بارگذاری...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
                        <span className="text-white text-4xl font-bold">
                            {userdata.username?.charAt(0) || 'U'}
                        </span>
                    </div>
                    <h1 className='text-3xl md:text-4xl text-white font-bold'>
                        {userdata.username || 'کاربر'}
                    </h1>
                    <div className={`mt-3 inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                        userdata.role === 'admin' 
                            ? 'bg-red-500/20 text-red-300' 
                            : 'bg-blue-500/20 text-blue-300'
                    }`}>
                        {role}
                    </div>
                </div>

                {/* اطلاعات کاربر */}
                <div className="bg-gray-800 rounded-2xl p-6 md:p-8 shadow-xl">
                    <h2 className="text-2xl text-white mb-6 border-b border-gray-700 pb-3">
                        اطلاعات حساب کاربری
                    </h2>
                    
                    <div className="space-y-6">
                        {/* ایمیل */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                            <div className="mb-3 sm:mb-0">
                                <span className="text-gray-400 text-sm block">ایمیل</span>
                                <span className="text-white text-lg">{userdata.email || '---'}</span>
                            </div>
                            <span className="text-blue-400"></span>
                        </div>

                        {/* شماره تلفن */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                            <div className="mb-3 sm:mb-0">
                                <span className="text-gray-400 text-sm block">شماره تلفن</span>
                                <span className="text-white text-lg">{userdata.number || '---'}</span>
                            </div>
                            <span className="text-green-400"></span>
                        </div>

                        {/* تاریخ عضویت */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                            <div className="mb-3 sm:mb-0">
                                <span className="text-gray-400 text-sm block">تاریخ عضویت</span>
                                <span className="text-white text-lg">{formattedDate || '---'}</span>
                            </div>
                            <span className="text-yellow-400"></span>
                        </div>

                        {/* نقش */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                            <div className="mb-3 sm:mb-0">
                                <span className="text-gray-400 text-sm block">نقش در سیستم</span>
                                <span className="text-white text-lg">{role}</span>
                            </div>
                          
                        </div>

                        {/* ID کاربر */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-900/50 rounded-xl">
                            <div className="mb-3 sm:mb-0">
                                <span className="text-gray-400 text-sm block">شناسه کاربری</span>
                                <span className="text-white text-lg font-mono">{userdata.id || '---'}</span>
                            </div>
                            <span className="text-purple-400"></span>
                        </div>
                    </div>

                   
                    <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row gap-4">
                      
                        
                        <button 
                            onClick={() => {
                                Cookies.remove('token');
                                setUserdata()
                                router.push('/auth');
                                
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors duration-200"
                        >
                            خروج از حساب
                        </button>
                    </div>
                </div>
            <h1 className='text-center text-white text-2xl mt-5'>اگهی های من </h1>
            <div className='grid grid-cols-1 sm:grid-cols-1  lg:grid-cols-2  gap-5 mt-10'>
              {userdata.cars.map((car)=>{
                return(
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
                )



              })


              }



            </div>
                
                
            </div>
        </div>
    );
}

export default ProfilePage;