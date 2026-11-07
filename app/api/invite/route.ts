import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Путь к нашему файлу "базы данных"
const dbPath = path.join(process.cwd(), 'db.json');

// Функция для чтения базы
function getDb() {
  if (!fs.existsSync(dbPath)) return {};
  const content = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(content);
}

// Функция для сохранения в базу
function saveDb(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Обработка POST запроса (сохранение приглашения)
export async function POST(req: Request) {
  const body = await req.json();
  const db = getDb();
  db[body.slug] = body; // Сохраняем по уникальному ключу
  saveDb(db);
  return NextResponse.json({ success: true });
}

// Обработка GET запроса (получение приглашения)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const db = getDb();
  
  if (slug && db[slug]) {
    return NextResponse.json(db[slug]);
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}