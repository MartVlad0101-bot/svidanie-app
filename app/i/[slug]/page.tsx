"use client";

import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';

function InvitationContent() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState('loading');
  
  const [isAccepted, setIsAccepted] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  // Добавляем счетчик нажатий на "Нет"
  const [noCount, setNoCount] = useState(0);

  useEffect(() => {
    fetch(`/api/invite?slug=${slug}`)
      .then(res => res.json())
      .then(resData => {
        if (resData.error) {
          setStatus('error');
        } else {
          setData(resData);
          setStatus('success');
        }
      })
      .catch(() => setStatus('error'));
  }, [slug]);

  const moveNoButton = () => {
    // Генерируем случайные координаты
    const randomX = Math.random() * 250 - 125; 
    const randomY = Math.random() * 250 - 125; 
    setNoButtonPos({ x: randomX, y: randomY });
    setNoCount(prev => prev + 1);
  };

  const handleAccept = async () => {
    setIsAccepted(true);
    await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, answer: 'yes' }),
    });
  };

  // Тексты для кнопки "Нет" в зависимости от количества попыток
  const noTexts = [
    "Нет...",
    "Точно нет?",
    "Подумай еще раз!",
    "Не убегай от меня 😢",
    "Ладно, я сдаюсь...",
    "Нажми на ДА 💖" // Если навести 6 раз, текст станет таким
  ];

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-rose-500 text-xl font-bold">Загрузка...</div>;
  if (status === 'error') return <div className="min-h-screen flex items-center justify-center text-red-500 text-xl font-bold">Приглашение не найдено</div>;

  if (isAccepted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-rose-500 p-6 text-center">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl">
          <h1 className="text-5xl mb-6">🎉</h1>
          <h2 className="text-3xl font-extrabold text-rose-600 mb-4">Ура! Ты сказал(а) ДА!</h2>
          <p className="text-gray-600 text-lg">
            Я очень рад. Скоро напишу тебе, чтобы договориться!
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-rose-50 p-6 text-center overflow-hidden relative">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl z-10">
        <h1 className="text-3xl font-extrabold text-rose-600 mb-4 tracking-tight">
          Привет, {data.recipientName || 'солнышко'}!
        </h1>
        <p className="text-2xl font-medium text-gray-800 mb-6">{data.question}</p>
        {data.message && <p className="text-gray-600 mb-8 italic">"{data.message}"</p>}
        
        <div className="flex gap-4 justify-center mt-8 relative h-16">
          <button 
            onClick={handleAccept}
            className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all text-lg w-1/2 absolute left-0 z-10"
          >
            Да 💖
          </button>
          
          <button 
            onMouseEnter={moveNoButton}
            onClick={moveNoButton}
            style={{ 
              transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`, 
              transition: 'transform 0.2s ease-out, background-color 0.3s'
            }}
            className={`font-bold py-3 px-8 rounded-xl shadow-lg text-lg absolute right-0 transition-all ${
              noCount > 3 ? 'bg-rose-100 text-rose-500 text-sm scale-90' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {noTexts[Math.min(noCount, noTexts.length - 1)]}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function InvitationView() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-rose-500 text-xl font-bold">Загрузка...</div>}>
      <InvitationContent />
    </Suspense>
  );
}