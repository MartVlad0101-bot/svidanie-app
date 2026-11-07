import dns from 'node:dns';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Отключаем кеширование Next.js для этого API
export const dynamic = 'force-dynamic';

dns.setDefaultResultOrder('ipv4first');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const supabaseUrl = 'https://unaxyjdtrswwllazbhh.supabase.co';
const supabaseKey = 'sb_publishable_oNMrdmRcgcSSa2OEChqdEQ_M8FoCB19'; 

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
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
        { onConflict: 'slug' }
      );

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("ОШИБКА SUPABASE (POST):", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      // ИСПОЛЬЗУЕМ maybeSingle() вместо single() — это безопаснее
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
        
      if (error) throw error;
      if (!data) throw new Error('Not found');
      
      return NextResponse.json({
        slug: data.slug,
        recipientName: data.recipient_name,
        question: data.question,
        message: data.message,
        answer: data.answer
      });
    } else {
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