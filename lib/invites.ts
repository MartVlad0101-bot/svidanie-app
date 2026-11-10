import { getPool } from './db';
import { newSlug } from './slug';

export type Answer = 'yes' | null;
export type Invitation = { slug: string; recipientName: string | null; question: string; message: string | null; answer: Answer; createdAt: string; };
type Row = { slug: string; recipient_name: string | null; question: string; message: string | null; answer: string | null; created_at: Date; };
const SELECT_COLUMNS = 'slug, recipient_name, question, message, answer, created_at';

function toInvitation(row: Row): Invitation {
  return { slug: row.slug, recipientName: row.recipient_name, question: row.question, message: row.message, answer: row.answer === 'yes' ? 'yes' : null, createdAt: row.created_at.toISOString() };
}

export async function getInvite(slug: string): Promise<Invitation | null> {
  const { rows } = await getPool().query<Row>(`select ${SELECT_COLUMNS} from invitations where slug = $1 limit 1`, [slug]);
  return rows[0] ? toInvitation(rows[0]) : null;
}

export async function createInvite(input: any): Promise<Invitation> {
  const pool = getPool();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { rows } = await pool.query<Row>(
      `insert into invitations (slug, recipient_name, question, message) values ($1, $2, $3, $4) on conflict (slug) do nothing returning ${SELECT_COLUMNS}`,
      [newSlug(), input.recipientName, input.question, input.message],
    );
    if (rows[0]) return toInvitation(rows[0]);
  }
  throw new Error('slug_generation_failed');
}

export async function acceptInvite(slug: string): Promise<boolean> {
  const result = await getPool().query(`update invitations set answer = 'yes', answered_at = now() where slug = $1 and answer is null`, [slug]);
  return (result.rowCount ?? 0) > 0;
}

export async function listInvites(): Promise<Invitation[]> {
  const { rows } = await getPool().query<Row>(`select ${SELECT_COLUMNS} from invitations order by created_at desc limit 500`);
  return rows.map(toInvitation);
}

export async function exists(slug: string): Promise<boolean> {
  const { rows } = await getPool().query('select 1 from invitations where slug = $1 limit 1', [slug]);
  return rows.length > 0;
}