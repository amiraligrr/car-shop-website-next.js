import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Card from '@/componnets/card';

const UserProfile = () => {
    const router = useRouter();
    const { id } = router.query;
    const [isClient, setIsClient] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3001/users/${id}`);
                setUserData(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('کاربر یافت نشد!');
                setUserData(null);
            } finally {
                setLoading(false);
            }
        };

        if (isClient && id) {
            fetchUserData();
        }
    }, [id, isClient]);

    
    if (!isClient || !router.isReady || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-white text-xl">در حال بارگذاری...</div>
                </div>
            </div>
        );
    }

  
    if (error || !userData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="text-red-500 text-2xl mb-4">⚠️ {error || 'کاربر یافت نشد!'}</div>
                    <button 
                        onClick={() => router.back()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                        بازگشت
                    </button>
                </div>
            </div>
        );
    }

  
    const formatPersianDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };


    const toPersianNumber = (num) => {
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return num.toString().replace(/\d/g, (d) => persianDigits[d]);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* دکمه بازگشت */}
                <button 
                    onClick={() => router.back()}
                    className="mb-8 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                    <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    بازگشت
                </button>

           
                <div className="text-center mb-12 bg-gray-800 rounded-2xl p-8 shadow-xl">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
                        <span className="text-white text-5xl font-bold">
                            {userData.username?.charAt(0) || 'U'}
                        </span>
                    </div>
                    <h1 className='text-3xl md:text-4xl font-bold mb-3'>
                        {userData.username || 'کاربر'}
                    </h1>
                    <div className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                        userData.role === 'admin' 
                            ? 'bg-red-500/20 text-red-300' 
                            : 'bg-green-500/20 text-green-300'
                    }`}>
                        {userData.role === 'admin' ? 'ادمین' : 'کاربر'}
                    </div>
                    <p className="text-gray-400 mt-4">
                        عضو شده در {formatPersianDate(userData.createdAt)}
                    </p>
                </div>

              
                {userData.number && (
                    <div className="bg-gray-800 rounded-2xl p-6 mb-8 shadow-xl">
                        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-3">
                            📞 تماس با کاربر
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <p className="text-gray-400 text-sm">برای ارتباط با این کاربر می‌توانید تماس بگیرید:</p>
                            </div>
                            <a 
                                href={`tel:${userData.number}`}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 whitespace-nowrap"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                تماس با {toPersianNumber(userData.number)}
                            </a>
                        </div>
                        <p className="text-gray-500 text-sm mt-3">
                             شماره در فرمت بین‌المللی: +98 {toPersianNumber(userData.number.substring(1))}
                        </p>
                    </div>
                )}

           
                <div className="bg-gray-800 rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-700">
                        <h2 className="text-2xl font-bold">
                             آگهی‌های {userData.username}
                        </h2>
                        <div className="mt-2 sm:mt-0 px-4 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                            {userData.cars?.length || 0} آگهی
                        </div>
                    </div>

                    {userData.cars && userData.cars.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6">
                            {userData.cars.map((car, index) => (
                                <Card
                                    key={car.id || index}
                                    brandpic={car.brandpic}
                                    id={car.id || index}
                                    title={car.title}
                                    img={car.img}
                                    price={car.price}
                                    brand={car.brand}
                                    year={car.year}
                                    km={car.km}
                                    city={car.city}
                                    description={car.description}
                                    showContact={false} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-xl mb-4">
                                📭 این کاربر هنوز آگهی ثبت نکرده است
                            </div>
                            <p className="text-gray-500">
                                می‌توانید با تماس با کاربر درخواست خود را مطرح کنید
                            </p>
                        </div>
                    )}

                 
                    
                </div>

            
               
            </div>
        </div>
    );
};

export default UserProfile;