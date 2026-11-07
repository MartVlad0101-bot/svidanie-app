import dns from 'node:dns';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ПРИНУДИТЕЛЬНО ВКЛЮЧАЕМ IPv4 (чтобы обойти сетевые ограничения)
dns.setDefaultResultOrder('ipv4first');

// ОТКЛЮЧАЕМ СТРОГУЮ ПРОВЕРКУ SSL (чтобы сервер ONREZA мог достучаться до Supabase)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Ваши данные из Supabase
const supabaseUrl = 'https://unaxyjdtrswwllazbhh.supabase.co';
// Вставьте ваш ключ (в самом конце должна быть кавычка)
const supabaseKey = 'sb_publishable_oNMrdmRcgcSSa2OEChqdEQ_M8FoCB19'; 

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Сохраняем или обновляем приглашение в базе
    const { error } = await supabase
      .from('invitations')
      .upsert(
        { 
          slug: body.slug, 
          recipient_name: body.recipientName, 
          question: body.question, 
          message: body.message,
          answer: body.answer || null
        },
        { onConflict: 'slug' } // Если такой slug уже есть, обновляем его
      );

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("ОШИБКА SUPABASE (POST):", error.message); // Выведет ошибку в логи ONREZA
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      // Получаем одно приглашение
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (error || !data) throw new Error('Not found');
      
      // Преобразуем названия полей обратно для фронтенда
      const formattedData = {
        slug: data.slug,
        recipientName: data.recipient_name,
        question: data.question,
        message: data.message,
        answer: data.answer
      };
      
      return NextResponse.json(formattedData);
    } else {
      // Получаем весь список для Админки
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('id', { ascending: false });
        
      if (error) throw error;

      const formattedData = data.map((item: any) => ({
        slug: item.slug,
        recipientName: item.recipient_name,
        question: item.question,
        message: item.message,
        answer: item.answer
      }));

      return NextResponse.json(formattedData);
    }
  } catch (error: any) {
    console.error("ОШИБКА SUPABASE (GET):", error.message);
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}