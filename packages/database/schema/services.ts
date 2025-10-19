import { pgTable, uuid, varchar, decimal, integer, text, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const services = pgTable('services', {
  service_id: uuid('service_id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  duration: integer('duration').notNull(), // minutes
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const insertServiceSchema = createInsertSchema(services);
export const selectServiceSchema = createSelectSchema(services);

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

export const createServiceSchema = insertServiceSchema.pick({
  name: true,
  description: true,
  category: true,
  price: true,
  duration: true,
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;



