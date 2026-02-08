
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function CarDetailPage({ car }) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      </div>
    );
  }

  if (!car) return <div className="text-white text-center p-8">ماشین پیدا نشد!</div>;

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
        <img 
          className="w-full h-96 object-cover rounded-2xl" 
          src={car.img} 
          alt={`${car.brand} ${car.title}`}
        />
        
        <h1 className='text-white text-4xl text-center mt-6'>
          {car.brand} {car.title}
        </h1>
        
        <p className='text-gray-300 text-right mt-4 text-lg'>
          {car.description}
        </p>
        
        <div className='flex justify-end items-center mt-4'>
          <img 
            className='w-12 h-12 ml-2' 
            src={car.brandpic} 
            alt={car.brand}
          />
          <h1 className='text-white text-xl'>
            شرکت سازنده: {car.brand}
          </h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-right">
          <div className="text-white text-lg">
            <span className="text-gray-400">کارکرد: </span>
            {formatNumber(car.km)} کیلومتر
          </div>
          <div className="text-white text-lg">
            <span className="text-gray-400">سال تولید: </span>
            {car.year}
          </div>
          <div className="text-white text-lg">
            <span className="text-gray-400">شهر: </span>
            {car.city}
          </div>
          <div className="text-white text-lg">
            <span className="text-gray-400">وضعیت: </span>
            {car.condition || 'کارکرده'}
          </div>
        </div>
      </div>

      <div className='mt-8 bg-gray-800 rounded-2xl p-4 flex items-center justify-between'>
        <div className="w-1/3">
          <div className="bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-center cursor-pointer hover:bg-green-700 transition">
            دیدن پروفایل صاحب
          </div>
        </div>
        
        <div className="w-1/3">
          <h1 className='text-2xl text-center text-white'>
            قیمت: <span className='text-green-400 font-bold'>{formatNumber(car.price)} تومان</span>
          </h1>
        </div>
        
        <div className="w-1/3">
          <Link href={`/profile/${car.owner}`}>
            <div className="bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-center cursor-pointer hover:bg-blue-700 transition">
              اطلاعات تماس
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/cars">
          <div className="inline-block bg-gray-700 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition cursor-pointer">
            بازگشت به لیست ماشین‌ها
          </div>
        </Link>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch('http://localhost:3001/cars');
  const cars = await res.json();

  const paths = cars.map((car) => ({
    params: { id: car.id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`http://localhost:3001/cars/${params.id}`);
  
  if (!res.ok) {
    return {
      notFound: true,
    };
  }

  const car = await res.json();

  return {
    props: {
      car,
    },
    revalidate: 60,
  };
}












