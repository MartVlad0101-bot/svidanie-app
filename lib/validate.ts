export const SLUG_RE = /^[a-zA-Z0-9_-]{8,32}$/;

export function parseCreateInvite(body: any) {
  if (!body) return { ok: false, error: 'empty_body' };
  const recipientName = typeof body.recipientName === 'string' ? body.recipientName.trim() : null;
  const question = typeof body.question === 'string' ? body.question.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : null;

  if (!question || question.length > 200) return { ok: false, error: 'invalid_question' };
  if (recipientName && recipientName.length > 60) return { ok: false, error: 'name_too_long' };
  if (message && message.length > 1000) return { ok: false, error: 'message_too_long' };

  return { ok: true, value: { recipientName, question, message } };
}