import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import axios from "axios";
import { useData } from "@/context/data";

const AddAdPage = () => {
  const { userdata } = useData();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    km: "",
    city: "",
    discrip: "",
    brand: "",
    year: "",
    price: "",
    brandpic: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/auth");
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBrandChange = (e) => {
    const brandValue = e.target.value;
    let brandpic = "";
    let brandName = "";
    
    if (brandValue === 'saipa') {
      brandName = 'سایپا';
      brandpic = 'https://www.finds.ir/bazaar/img/saipa-logo.png';
    } else if (brandValue === 'ikco') {
      brandName = 'ایران خودرو';
      brandpic = 'https://cdn.tarhpik.com/5_Preview/1403/3/19/212157/Telephoto-of-the-symbol-of-Iran-Khodro-400.webp';
    }
    
    setFormData(prev => ({
      ...prev,
      brand: brandValue,
      brandName: brandName,
      brandpic: brandpic
    }));
  };

  const sabthandler = async (e) => {
    e.preventDefault();
    setError("");
    
   
    if (!formData.name || !formData.km || !formData.brand || !formData.price || !formData.year) {
      setError("لطفا تمام فیلدهای ضروری را پر کنید");
      return;
    }
    
    if (!userdata?.id) {
      setError("کاربر شناسایی نشد");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:3001/cars', {
        img: '', 
        title: formData.name,
        brand: formData.brandName || (formData.brand === 'saipa' ? 'سایپا' : 'ایران خودرو'),
        km: parseInt(formData.km),
        city: formData.city,
        description: formData.discrip,
        brandpic: formData.brandpic,
        owner: userdata.id,
        price: parseInt(formData.price),
        year: parseInt(formData.year),
        createdAt: new Date().toISOString()
      });
      
      if (response.status === 200 || response.status === 201) {
        alert("آگهی با موفقیت ثبت شد!");
       await axios.put(`http://localhost:3001/users/${userdata.id}`, {
  ...userdata, 
  cars: [...userdata.cars, {
        img: '', 
        title: formData.name,
        brand: formData.brandName || (formData.brand === 'saipa' ? 'سایپا' : 'ایران خودرو'),
        km: parseInt(formData.km),
        city: formData.city,
        description: formData.discrip,
        brandpic: formData.brandpic,
        owner: userdata.id,
        price: parseInt(formData.price),
        year: parseInt(formData.year),
        createdAt: new Date().toISOString()
      }] 
});
        router.push("/profile"); 
      }
    } catch (error) {
      console.error("خطا در ثبت آگهی:", error);
      setError("خطا در ثبت آگهی. لطفا دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-white text-3xl mt-5 text-center">افزودن آگهی</h1>
      <div className="min-h-screen py-8 px-4">
        <form onSubmit={sabthandler} className="mt-5 shadow-2xl shadow-green-500 bg-gray-800 max-w-lg mx-auto rounded-2xl p-6 shadow-xl border border-gray-700">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <input
              name="name"
              type="text"
              className="bg-gray-900 text-white rounded-xl w-full h-12 px-4 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="مدل ماشین (مثال: تیبا 2)"
              required
              value={formData.name}
              onChange={handleInputChange}
            />

            <input
              name="km"
              type="number"
              className="bg-gray-900 text-white rounded-xl w-full h-12 px-4 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="کارکرد (کیلومتر)"
              required
              value={formData.km}
              onChange={handleInputChange}
              min="0"
            />

            <input
              name="city"
              type="text"
              className="bg-gray-900 text-white rounded-xl w-full h-12 px-4 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="شهر"
              value={formData.city}
              onChange={handleInputChange}
            />

            <textarea
              name="discrip"
              className="bg-gray-900 text-white rounded-xl w-full px-4 py-3 h-24 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="توضیحات تکمیلی"
              value={formData.discrip}
              onChange={handleInputChange}
            />

            <input
              name="price"
              type="number"
              className="bg-gray-900 text-white rounded-xl w-full h-12 px-4 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="قیمت (تومان)"
              required
              value={formData.price}
              onChange={handleInputChange}
              min="0"
            />

            <input
              name="year"
              type="number"
              className="bg-gray-900 text-white rounded-xl w-full h-12 px-4 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="سال ساخت"
              required
              value={formData.year}
              onChange={handleInputChange}
              min="1300"
              max="1403"
            />

            <select
              name="brand"
              value={formData.brand}
              onChange={handleBrandChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 h-12 text-white text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- برند خودرو را انتخاب کنید --</option>
              <option value="ikco">ایران خودرو</option>
              <option value="saipa">سایپا</option>
            </select>
            
            {/* نمایش لوگوی برند انتخاب شده */}
            {formData.brandpic && (
              <div className="flex items-center justify-center p-4 bg-gray-900 rounded-xl">
                <div className="text-center">
                  <p className="text-gray-400 mb-2">برند انتخاب شده:</p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={formData.brandpic} 
                      alt={formData.brandName} 
                      className="w-12 h-12 object-contain"
                    />
                    <span className="text-white text-lg">{formData.brandName}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-8">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl px-8 py-3 text-lg font-semibold transition-colors duration-200 min-w-[120px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  در حال ثبت...
                </span>
              ) : "ثبت آگهی"}
            </button>
          </div>
        </form>
        
       
        <div className="max-w-lg mx-auto mt-6 text-gray-400 text-sm">
          <p className="text-center">
            پس از ثبت، آگهی شما در لیست خودروها نمایش داده خواهد شد
          </p>
        </div>
      </div>
    </>
  );
};

export default AddAdPage;