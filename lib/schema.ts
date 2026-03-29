import { pgTable, uuid, text, numeric, pgEnum, date, timestamp } from 'drizzle-orm/pg-core'

export const statusEnum = pgEnum('status', ['draft', 'sent', 'won', 'lost'])

export const quotes = pgTable('quotes', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerName: text('customer_name').notNull(),
  jobDescription: text('job_description').notNull(),
  quoteAmount: numeric('quote_amount', { precision: 10, scale: 2 }).notNull(),
  status: statusEnum('status').notNull().default('draft'),
  followUpDate: date('follow_up_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Quote = typeof quotes.$inferSelect
export type NewQuote = typeof quotes.$inferInsert
