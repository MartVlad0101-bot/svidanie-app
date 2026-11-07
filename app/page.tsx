import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-rose-50 p-6 text-center">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl">
        <h1 className="text-4xl font-extrabold text-rose-600 mb-4 tracking-tight">
          Пригласи на свидание 💌
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Создай красивую интерактивную открытку за пару минут. Отправь ссылку и узнай ответ!
        </p>
        
        <Link 
          href="/create" 
          className="block w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 mb-4"
        >
          Создать приглашение
        </Link>

        <Link 
          href="/admin" 
          className="block w-full bg-white border-2 border-rose-500 text-rose-500 font-bold py-3 px-8 rounded-2xl transition-all hover:bg-rose-50"
        >
          Мои приглашения (Админка)
        </Link>
      </div>
    </main>
  );
}