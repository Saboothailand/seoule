import { pgTable, uuid, varchar, timestamp, text, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const members = pgTable('members', {
  member_id: uuid('member_id').primaryKey().defaultRandom(),
  full_name: varchar('full_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  email: varchar('email', { length: 255 }),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

// Zod schemas for validation
export const insertMemberSchema = createInsertSchema(members);
export const selectMemberSchema = createSelectSchema(members);

// TypeScript types
export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

// Validation schemas
export const createMemberSchema = insertMemberSchema.pick({
  full_name: true,
  phone: true,
  email: true,
});

export const updateMemberSchema = insertMemberSchema.partial().pick({
  full_name: true,
  phone: true,
  email: true,
  status: true,
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;



