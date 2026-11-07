"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/invite')
      .then(res => res.json())
      .then(data => {
        setInvitations(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Мои приглашения</h1>
          <Link href="/" className="text-rose-500 hover:underline font-medium">
            ← На главную
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 font-medium">Загрузка...</p>
        ) : invitations.length === 0 ? (
          <p className="text-gray-500 font-medium">У вас пока нет созданных приглашений.</p>
        ) : (
          <div className="grid gap-4">
            {invitations.map((inv: any) => (
              <div key={inv.slug} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Для кого: {inv.recipientName || 'Без имени'}</h2>
                  <p className="text-gray-500 text-sm mt-1">Вопрос: {inv.question}</p>
                  <p className="text-gray-400 text-xs mt-2">Ссылка: /i/{inv.slug}</p>
                </div>
                
                <div>
                  {inv.answer === 'yes' ? (
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold">
                      Согласились 💖
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg font-medium">
                      Ждем ответа...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}