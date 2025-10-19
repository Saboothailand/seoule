import { pgTable, uuid, varchar, timestamp, text, decimal } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const staffs = pgTable('staffs', {
  staff_id: uuid('staff_id').primaryKey().defaultRandom(),
  full_name: varchar('full_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  position: varchar('position', { length: 50 }).notNull(),
  hourly_rate: decimal('hourly_rate', { precision: 10, scale: 2 }),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const insertStaffSchema = createInsertSchema(staffs);
export const selectStaffSchema = createSelectSchema(staffs);

export type Staff = typeof staffs.$inferSelect;
export type NewStaff = typeof staffs.$inferInsert;

export const createStaffSchema = insertStaffSchema.pick({
  full_name: true,
  phone: true,
  email: true,
  position: true,
  hourly_rate: true,
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;



