import React, { useState, useEffect } from 'react';
import { useData } from '@/context/data';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

const Admin = () => {
    const { userdata, loading, error } = useData();
    const router = useRouter();
    const [cars, setCars] = useState([]);
    const [users, setUsers] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('stats'); // 'stats', 'users', 'cars'

    useEffect(() => {
        // اگر کاربر ادمین نیست، صفحه را ریدایرکت کن
        if (!loading && userdata && userdata.role !== 'admin') {
            router.push('/profile');
            return;
        }

        // اگر کاربر ادمین است، داده‌ها را بگیر
        if (!loading && userdata && userdata.role === 'admin') {
            fetchAdminData();
        }
    }, [userdata, loading, router]);

    const fetchAdminData = async () => {
        try {
            setFetchLoading(true);
            setFetchError(null);
            
            // استفاده از Promise.all برای درخواست‌های موازی
            const [carsResponse, usersResponse] = await Promise.all([
                axios.get('http://localhost:3001/cars'),
                axios.get('http://localhost:3001/users')
            ]);
            
            setCars(carsResponse.data);
            setUsers(usersResponse.data);
        } catch (err) {
            console.error('Error fetching admin data:', err);
            setFetchError('خطا در دریافت اطلاعات از سرور');
        } finally {
            setFetchLoading(false);
        }
    };

    // تابع حذف کاربر
    const handleDeleteUser = async (userId) => {
        if (!confirm('آیا از حذف این کاربر مطمئن هستید؟')) return;
        
        try {
            await axios.delete(`http://localhost:3001/users/${userId}`);
            // به روز رسانی لیست کاربران
            setUsers(users.filter(user => user.id !== userId));
            alert('کاربر با موفقیت حذف شد');
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('خطا در حذف کاربر');
        }
    };

    // تابع حذف آگهی
    const handleDeleteCar = async (carId) => {
        if (!confirm('آیا از حذف این آگهی مطمئن هستید؟')) return;
        
        try {
            await axios.delete(`http://localhost:3001/cars/${carId}`);
            // به روز رسانی لیست آگهی‌ها
            setCars(cars.filter(car => car.id !== carId));
            alert('آگهی با موفقیت حذف شد');
        } catch (err) {
            console.error('Error deleting car:', err);
            alert('خطا در حذف آگهی');
        }
    };

    // محاسبه آمار
    const totalCars = cars.length;
    const totalUsers = users.length;
    const activeCars = cars.filter(car => car.status === 'active').length;
    const verifiedUsers = users.filter(user => user.verified).length;

    // حالت loading اولیه
    if (loading || fetchLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-300">در حال بارگذاری...</p>
                </div>
            </div>
        );
    }

    // حالت خطا
    if (error || fetchError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center text-red-400">
                    <p className="text-xl">خطا در دریافت اطلاعات</p>
                    <p className="mt-2">{error || fetchError}</p>
                    <button 
                        onClick={fetchAdminData}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        تلاش مجدد
                    </button>
                </div>
            </div>
        );
    }

    // اگر کاربر ادمین نیست یا داده‌ای نداریم، ریدایرکت می‌کنیم
    if (!userdata || userdata.role !== 'admin') {
        return null; // در حین ریدایرکت چیزی نشان نده
    }

    // Tab navigation
    const renderTabContent = () => {
        switch (selectedTab) {
            case 'stats':
                return (
                    <>
                        {/* اطلاعات کاربر ادمین */}
                        <div className='bg-gray-800 rounded-2xl p-6 mb-8'>
                            <h2 className='text-xl text-white mb-4'>اطلاعات مدیر</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                                <div className="p-3 bg-gray-700 rounded-lg">
                                    <p className="text-gray-300">نام کاربری:</p>
                                    <p className="font-bold">{userdata.username || userdata.email}</p>
                                </div>
                                <div className="p-3 bg-gray-700 rounded-lg">
                                    <p className="text-gray-300">نقش:</p>
                                    <p className="font-bold text-green-400">{userdata.role}</p>
                                </div>
                                <div className="p-3 bg-gray-700 rounded-lg">
                                    <p className="text-gray-300">ایمیل:</p>
                                    <p className="font-bold">{userdata.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* آمار کلی */}
                        <div className='bg-gray-800 rounded-2xl p-6 mb-8'>
                            <h2 className='text-xl text-white mb-6'>آمار کلی</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-4">
                                    <p className="text-blue-300">تعداد کل کاربران</p>
                                    <p className="text-3xl font-bold text-white mt-2">{totalUsers}</p>
                                    <p className="text-sm text-blue-200 mt-1">کاربر تأیید شده: {verifiedUsers}</p>
                                </div>
                                
                                <div className="bg-green-900/30 border border-green-700 rounded-xl p-4">
                                    <p className="text-green-300">تعداد کل آگهی‌ها</p>
                                    <p className="text-3xl font-bold text-white mt-2">{totalCars}</p>
                                    <p className="text-sm text-green-200 mt-1">آگهی فعال: {activeCars}</p>
                                </div>
                                
                                <div className="bg-purple-900/30 border border-purple-700 rounded-xl p-4">
                                    <p className="text-purple-300">کاربران امروز</p>
                                    <p className="text-3xl font-bold text-white mt-2">
                                        {users.filter(user => 
                                            new Date(user.createdAt).toDateString() === new Date().toDateString()
                                        ).length}
                                    </p>
                                    <p className="text-sm text-purple-200 mt-1">ثبت‌نام امروز</p>
                                </div>
                                
                                <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-4">
                                    <p className="text-yellow-300">آگهی‌های امروز</p>
                                    <p className="text-3xl font-bold text-white mt-2">
                                        {cars.filter(car => 
                                            new Date(car.createdAt).toDateString() === new Date().toDateString()
                                        ).length}
                                    </p>
                                    <p className="text-sm text-yellow-200 mt-1">ثبت شده امروز</p>
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 'users':
                return (
                    <div className='bg-gray-800 rounded-2xl p-6 mb-8'>
                        <h2 className='text-xl text-white mb-4'>مدیریت کاربران ({totalUsers})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-white">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="p-3 text-right">شناسه</th>
                                        <th className="p-3 text-right">نام کاربری</th>
                                        <th className="p-3 text-right">ایمیل</th>
                                        <th className="p-3 text-right">نقش</th>
                                        <th className="p-3 text-right">تاریخ ثبت‌نام</th>
                                        <th className="p-3 text-right">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                            <td className="p-3">{user.id}</td>
                                            <td className="p-3">{user.username || 'بدون نام'}</td>
                                            <td className="p-3">{user.email}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    user.role === 'admin' 
                                                        ? 'bg-red-900/50 text-red-300' 
                                                        : 'bg-green-900/50 text-green-300'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex gap-2">
                                                    <Link href={`/profile/${user.id}`}>
                                                        <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                                                            مشاهده
                                                        </button>
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                                                    >
                                                        حذف
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'cars':
                return (
                    <div className='bg-gray-800 rounded-2xl p-6 mb-8'>
                        <h2 className='text-xl text-white mb-4'>مدیریت آگهی‌ها ({totalCars})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-white">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="p-3 text-right">شناسه</th>
                                        <th className="p-3 text-right">برند</th>
                                        <th className="p-3 text-right">مدل</th>
                                        <th className="p-3 text-right">قیمت</th>
                                        <th className="p-3 text-right">کاربر</th>
                                        <th className="p-3 text-right">تاریخ ثبت</th>
                                        <th className="p-3 text-right">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cars.map((car) => (
                                        <tr key={car.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                            <td className="p-3">{car.id}</td>
                                            <td className="p-3">{car.brand}</td>
                                            <td className="p-3">{car.title}</td>
                                            <td className="p-3">
                                                {car.price.toLocaleString()} تومان
                                            </td>
                                            <td className="p-3">
                                                <Link href={`/profile/${car.owner}`} className="text-blue-400 hover:text-blue-300">
                                                    مشاهده کاربر
                                                </Link>
                                            </td>
                                            <td className="p-3">
                                                {new Date(car.createdAt).toLocaleDateString('fa-IR')}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex gap-2">
                                                    <Link href={`/cars/${car.id}`}>
                                                        <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                                                            مشاهده
                                                        </button>
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDeleteCar(car.id)}
                                                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                                                    >
                                                        حذف
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <h1 className='text-center text-3xl text-white mb-8'>پنل ادمین</h1>
            
            {/* تب‌های ناوبری */}
            <div className="flex flex-wrap gap-2 mb-8">
                <button
                    onClick={() => setSelectedTab('stats')}
                    className={`px-6 py-3 rounded-lg font-medium transition ${
                        selectedTab === 'stats' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    📊 آمار کلی
                </button>
                <button
                    onClick={() => setSelectedTab('users')}
                    className={`px-6 py-3 rounded-lg font-medium transition ${
                        selectedTab === 'users' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    👥 مدیریت کاربران
                </button>
                <button
                    onClick={() => setSelectedTab('cars')}
                    className={`px-6 py-3 rounded-lg font-medium transition ${
                        selectedTab === 'cars' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    🚗 مدیریت آگهی‌ها
                </button>
            </div>

            {/* محتوای تب */}
            {renderTabContent()}

            {/* دکمه رفرش */}
            <div className="mt-8 text-center">
                <button 
                    onClick={fetchAdminData}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
                >
                    🔄 بروزرسانی اطلاعات
                </button>
            </div>
        </div>
    );
};

export default Admin;