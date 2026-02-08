import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useData } from '@/context/data';
const Index = () => {
    const router = useRouter();
    const [mode, setMode] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailn, setEmailn] = useState('');
    const [passwordn, setPasswordn] = useState('');
    const [username, setUsername] = useState('');
    const [number, setNumber] = useState('');
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
const {setUserdata} =useData()
   
    useEffect(() => {
        setIsClient(true);
        
        const token = Cookies.get('token');
        if (token) {
            router.push('/profile');
        }
    }, [router]);


    const loghandler = async () => {
        if (!email || !password) {
            Swal.fire({
                icon: "error",
                title: "خطا",
                text: "لطفا ایمیل و رمز عبور را وارد کنید",
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:3001/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
            );
            
            if (response.data.length === 1) {
                const user = response.data[0];
                Cookies.set('token', user.id, { expires: 7 }); // 7 روز اعتبار
                
                await Swal.fire({
                    title: "ورود موفق!",
                    text: `خوش آمدید ${user.username}`,
                    icon: "success",
                    confirmButtonText: "ادامه"
                });
                setUserdata(response.data)
                router.push('/');
            } else {
                Swal.fire({
                    icon: "error",
                    title: "خطا",
                    text: "ایمیل یا رمز عبور اشتباه است",
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            Swal.fire({
                icon: "error",
                title: "خطا",
                text: "اتصال با سرور برقرار نیست",
            });
        } finally {
            setIsLoading(false);
        }
    };

  
    const newhandler = async () => {
        if (!emailn || !passwordn || !username) {
            Swal.fire({
                icon: "error",
                title: "خطا",
                text: "لطفا تمام فیلدهای ضروری را پر کنید",
            });
            return;
        }

        setIsLoading(true);
        try {
      
            const checkResponse = await axios.get(
                `http://localhost:3001/users?email=${encodeURIComponent(emailn)}`
            );
            
            if (checkResponse.data.length > 0) {
                Swal.fire({
                    icon: "error",
                    title: "خطا",
                    text: "این ایمیل قبلا استفاده شده است",
                });
                setIsLoading(false);
                return;
            }

            const newUser = {
                username,
                email: emailn,
                password: passwordn,
                number: number || null,
                role:"user",
                cars :[],
                createdAt: new Date().toISOString()
            };

            const createResponse = await axios.post('http://localhost:3001/users', newUser);
            
            Cookies.set('token', createResponse.data.id, { expires: 7 });
            
            await Swal.fire({
                title: "ثبت نام موفق!",
                text: `حساب کاربری ${username} ایجاد شد`,
                icon: "success",
                confirmButtonText: "ادامه"
            });
              setUserdata(newUser)
            router.push('/');
        } catch (error) {
            console.error('Register error:', error);
            Swal.fire({
                icon: "error",
                title: "خطا",
                text: "مشکلی در ثبت نام پیش آمد",
            });
        } finally {
            setIsLoading(false);
        }
    };

    
    if (!isClient) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white">در حال بارگذاری...</div>
            </div>
        );
    }


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                    <p className="text-white mt-4">در حال پردازش...</p>
                </div>
            </div>
        );
    }

    // حالت ورود (mode 0)
    if (mode === 0) {
        return (
            <div className="min-h-screen bg-gray-900 py-8 px-4">
                <div className='flex justify-center mt-10'>
                    <div className='h-15 w-40 text-white text-3xl mr-5 text-center my-auto rounded-2xl bg-green-900 hover:bg-green-800 cursor-default'>
                        <h1 className='text-center mx-auto my-auto py-2'>ورود</h1>
                    </div>
                    <div 
                        onClick={() => setMode(1)}
                        className='h-15 w-40 text-white text-3xl bg-green-500 hover:bg-green-600 text-center my-auto rounded-2xl cursor-pointer'
                    >
                        <h1 className='text-center mx-auto my-auto py-2'>ثبت نام</h1>
                    </div>
                </div>
                
                <div className='bg-gray-800 mt-5 max-w-lg mx-auto rounded-2xl p-6 shadow-xl shadow-green-600'>
                    <h1 className='text-center text-white text-4xl mb-6'>ورود</h1>
                    
                    <div className='space-y-4'>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="bg-gray-900 text-white rounded w-full h-12 px-4 text-center rounded-2xl"
                            placeholder="ایمیل خود را وارد کنید"
                            required
                            disabled={isLoading}
                        />
                        
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="bg-gray-900 text-white rounded w-full h-12 px-4 text-center rounded-2xl"
                            placeholder="رمز عبور خود را وارد کنید"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className='flex justify-center mt-8'>
                        <button 
                            onClick={loghandler}
                            disabled={isLoading}
                            className='bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-2xl px-8 py-3 text-lg font-semibold transition-colors duration-200'
                        >
                            {isLoading ? 'در حال ورود...' : 'ورود'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

 
    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4">
            <div className='flex justify-center mt-10'>
                <div 
                    onClick={() => setMode(0)}
                    className='h-15 w-40 text-white text-3xl mr-5 text-center my-auto rounded-2xl bg-green-500 hover:bg-green-600 cursor-pointer'
                >
                    <h1 className='text-center mx-auto my-auto py-2'>ورود</h1>
                </div>
                <div className='h-15 w-40 text-white text-3xl bg-green-900 hover:bg-green-900 text-center my-auto rounded-2xl cursor-default'>
                    <h1 className='text-center mx-auto my-auto py-2'>ثبت نام</h1>
                </div>
            </div>
            
            <div className='bg-gray-800 mt-5 max-w-lg mx-auto rounded-2xl p-6 shadow-xl shadow-green-600'>
                <h1 className='text-center text-white text-4xl mb-6'>ثبت نام</h1>
                
                <div className='space-y-4'>
                    <input
                        value={emailn}
                        onChange={(e) => setEmailn(e.target.value)}
                        type="email"
                        className="bg-gray-900 text-white rounded w-full h-12 px-4 text-center rounded-2xl"
                        placeholder="ایمیل خود را وارد کنید"
                        required
                        disabled={isLoading}
                    />
                    
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        className="bg-gray-900 text-white rounded w-full h-12 px-4 text-center rounded-2xl"
                        placeholder="نام کاربری"
                        required
                        disabled={isLoading}
                    />
                    
                    <input
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        type="tel"
                        className="bg-gray-900 text-white rounded w-full h-12 px-4 text-center rounded-2xl"
                        placeholder="شماره تلفن (اختیاری)"
                        disabled={isLoading}
                    />
                    
                    <input
                        value={passwordn}
                        onChange={(e) => setPasswordn(e.target.value)}
                        type="password"
                        className="bg-gray-900 text-white rounded w-full h-12 px-4 text-center rounded-2xl"
                        placeholder="رمز عبور خود را وارد کنید"
                        required
                        disabled={isLoading}
                    />
                </div>
                
                <div className='flex justify-center mt-8'>
                    <button 
                        onClick={newhandler}
                        disabled={isLoading}
                        className='bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-2xl px-8 py-3 text-lg font-semibold transition-colors duration-200'
                    >
                        {isLoading ? 'در حال ثبت نام...' : 'ثبت نام'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Index;