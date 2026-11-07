"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateInvitation() {
  const router = useRouter();
  const [recipientName, setRecipientName] = useState('');
  const [question, setQuestion] = useState('Пойдешь со мной на свидание?');
  const [message, setMessage] = useState('');

  // Та самая функция, которая отправляет данные на сервер
  const handleCreate = async () => {
    const slug = Math.random().toString(36).substring(2, 8);
    const invitationData = { slug, recipientName, question, message };
    
    await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invitationData),
    });
    
    router.push(`/i/${slug}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-rose-50 p-6">
      <div className="max-w-lg w-full bg-white p-8 rounded-3xl shadow-xl">
        <div className="mb-6">
          <Link href="/" className="text-rose-500 hover:underline text-sm font-medium">
            ← Назад на главную
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">Создание приглашения</h1>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Как зовут получателя?</label>
            <input 
              type="text" 
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Например: Аня" 
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Твой главный вопрос</label>
            <input 
              type="text" 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all text-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Сообщение (необязательно)</label>
            <textarea 
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Я знаю одно классное место, где делают лучший кофе..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all text-gray-800 resize-none"
            ></textarea>
          </div>

          <button 
            type="button"
            onClick={handleCreate}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg mt-4"
          >
            Создать и получить ссылку ✨
          </button>
        </form>
      </div>
    </main>
  );
}