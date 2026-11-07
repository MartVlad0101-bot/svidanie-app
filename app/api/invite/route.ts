import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Ваши данные из Supabase
const supabaseUrl = 'https://unaxyjdtrswwllazbhh.supabase.co';
const supabaseKey = 'sb_publishable_oNMrdmRcgcSSa2OEChqdEQ_M8FoCB19'; // Замените на скопированный ключ

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
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}