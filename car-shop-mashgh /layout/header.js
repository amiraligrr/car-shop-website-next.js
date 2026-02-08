import React, { useEffect, useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useData } from "@/context/data";
import { Menu, X, Home, LogIn, LogOut, Car } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const { userdata } = useData();
  const [token, setToken] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setIsClient(true);
    setToken(Cookies.get('token'));
  }, []);
  
  const handleLogout = () => {
    Cookies.remove('token');
    setToken(null);
    router.push('/auth');
  };
  
  const renderDesktopButtons = () => {
    return (
      <div className="hidden md:flex items-center gap-2">
        <Link href='/'>
          <div className="w-20 h-10 md:h-12 rounded-xl bg-green-500 shadow-lg shadow-green-700 hover:bg-green-600 text-center text-sm md:text-xl text-white cursor-pointer flex items-center justify-center px-3">
            <Home size={18} className="ml-1" />
            <span className="py-1 md:py-2">خانه</span>
          </div>
        </Link>
        
        <Link href='/cars'>
          <div className="w-24 h-10 md:h-12 rounded-xl bg-green-500 shadow-lg shadow-green-700 hover:bg-green-600 text-center text-sm md:text-xl text-white cursor-pointer flex items-center justify-center px-3">
            <Car size={18} className="ml-1" />
            <span className="py-1 md:py-2">ماشین‌ها</span>
          </div>
        </Link>
        
        {token ? (
          <>
            {userdata && userdata.role === 'admin' && (
              <Link href='/admin'>
                <div className="w-30 h-10 md:h-12 rounded-xl bg-green-500 shadow-lg shadow-green-700 hover:bg-green-600 text-center text-sm md:text-xl text-white cursor-pointer flex items-center justify-center px-3">
                  <span className="py-1 md:py-2">پنل ادمین</span>
                </div>
              </Link>
            )}
            <Link href='/addcar'>
              <div className="w-36 md:w-40 h-10 md:h-12 rounded-xl bg-green-500 shadow-lg shadow-green-700 hover:bg-green-600 text-center text-sm md:text-xl text-white cursor-pointer flex items-center justify-center px-3">
                <span className="py-1 md:py-2">اضافه کردن اگهی</span>
              </div>
            </Link>
            <Link href='/profile'>
              <div className="w-20 h-10 md:h-12 rounded-xl bg-green-500 shadow-lg shadow-green-700 hover:bg-green-600 text-center text-sm md:text-xl text-white cursor-pointer flex items-center justify-center px-3">
                <span className="py-1 md:py-2">پروفایل</span>
              </div>
            </Link>
            <button 
              onClick={handleLogout}
              className="w-20 h-10 md:h-12 rounded-xl bg-green-500 shadow-lg shadow-green-700 hover:bg-green-600 text-center text-sm md:text-xl text-white cursor-pointer flex items-center justify-center px-3"
            >
              <LogOut size={18} className="ml-1" />
              <span className="py-1 md:py-2">خروج</span>
            </button>
          </>
        ) : (
          <Link href='/auth'>
            <div className="w-20 h-10 md:h-12 rounded-xl bg-green-500 shadow-lg shadow-green-700 hover:bg-green-600 text-center text-sm md:text-xl text-white cursor-pointer flex items-center justify-center px-3">
              <LogIn size={18} className="ml-1" />
              <span className="py-1 md:py-2">ورود</span>
            </div>
          </Link>
        )}
      </div>
    );
  };
  
  const renderMobileMenu = () => {
    if (!isMenuOpen) return null;
    
    return (
      <div className="md:hidden absolute top-full left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg z-50 rounded-b-2xl">
        <div className="flex flex-col p-4 space-y-3">
          <Link href='/' onClick={() => setIsMenuOpen(false)}>
            <button className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white cursor-pointer flex items-center justify-center">
              <Home size={20} className="ml-2" />
              صفحه اصلی
            </button>
          </Link>
          
          <Link href='/cars' onClick={() => setIsMenuOpen(false)}>
            <button className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white cursor-pointer flex items-center justify-center">
              <Car size={20} className="ml-2" />
              ماشین‌ها
            </button>
          </Link>
          
          {token ? (
            <>
              {userdata && userdata.role === 'admin' && (
                <Link href='/admin' onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white cursor-pointer">
                    پنل ادمین
                  </button>
                </Link>
              )}
              <Link href='/addcar' onClick={() => setIsMenuOpen(false)}>
                <button className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white cursor-pointer">
                  اضافه کردن اگهی
                </button>
              </Link>
              <Link href='/profile' onClick={() => setIsMenuOpen(false)}>
                <button className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white cursor-pointer">
                  پروفایل
                </button>
              </Link>
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white cursor-pointer flex items-center justify-center"
              >
                <LogOut size={20} className="ml-2" />
                خروج از حساب
              </button>
            </>
          ) : (
            <Link href='/auth' onClick={() => setIsMenuOpen(false)}>
              <button className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white cursor-pointer flex items-center justify-center">
                <LogIn size={20} className="ml-2" />
                ورود / ثبت نام
              </button>
            </Link>
          )}
        </div>
      </div>
    );
  };
  
  const renderMobileMenuButton = () => {
    return (
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden ml-3 text-white"
      >
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
    );
  };
  
  if (!isClient) {
    return (
      <>
        <div className="h-5"></div>
        <div className="w-[100%] sm:w-[80%] h-12 md:h-15 bg-gray-800 mx-auto rounded-2xl shadow-green-600 shadow-2xl flex items-center justify-center px-4">
          <Image
            src="/icone.svg"
            alt="icon"
            width={32}
            height={32}
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <h1 className="text-white text-lg md:text-2xl ml-3">فروشگاه ماشین</h1>
        </div>
      </>
    );
  }
  
  return (
    <>
      <div className="h-5"></div>
      
      <div className="relative">
        <div className="w-[100%] sm:w-[90%] md:w-[80%] h-12 md:h-15 bg-gray-800 mx-auto rounded-2xl shadow-green-600 shadow-2xl flex items-center justify-between px-3 md:px-4">
          
          <div className="flex items-center flex-1">
            <div className="md:hidden">
              <Link href='/'>
                <button className="text-white hover:text-green-400 p-1">
                  <Home size={24} />
                </button>
              </Link>
            </div>
            
            {token && userdata?.username ? (
              <h1 className="text-white text-sm md:text-2xl truncate max-w-[150px] md:max-w-none ml-2 md:ml-0">
                {userdata.username}
              </h1>
            ) : (
              <div className="flex items-center">
                <Image
                  src="/icone.svg"
                  alt="icon"
                  width={32}
                  height={32}
                  className="w-8 h-8 md:w-10 md:h-10"
                />
                <h1 className="text-white text-sm md:text-2xl ml-2 md:ml-3 hidden sm:block">
                  فروشگاه ماشین
                </h1>
                <h1 className="text-white text-sm md:text-2xl ml-2 md:ml-3 sm:hidden">
                  فروشگاه
                </h1>
              </div>
            )}
          </div>
          
          {renderDesktopButtons()}
          
          {renderMobileMenuButton()}
        </div>
        
        {renderMobileMenu()}
      </div>
    </>
  );
};

export default Header;