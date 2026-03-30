// Feature flags — enable per user email via env var
// .env.local: LINE_ITEMS_EMAILS=you@example.com,other@example.com

const LINE_ITEMS_EMAILS = (process.env.LINE_ITEMS_EMAILS ?? '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean)

export function lineItemsEnabled(email: string): boolean {
  return LINE_ITEMS_EMAILS.includes(email.toLowerCase())
}
