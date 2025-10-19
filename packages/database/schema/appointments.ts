import { pgTable, uuid, varchar, timestamp, text, decimal, integer, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Appointment status enum
export const appointmentStatusEnum = pgEnum('appointment_status', [
  'scheduled',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
]);

export const appointments = pgTable('appointments', {
  appointment_id: uuid('appointment_id').primaryKey().defaultRandom(),
  member_id: uuid('member_id').notNull(),
  staff_id: uuid('staff_id').notNull(),
  service_id: uuid('service_id').notNull(),
  appointment_date: timestamp('appointment_date').notNull(),
  duration: integer('duration').notNull(), // in minutes
  status: appointmentStatusEnum('status').notNull().default('scheduled'),
  total_price: decimal('total_price', { precision: 10, scale: 2 }),
  notes: text('notes'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export const insertAppointmentSchema = createInsertSchema(appointments);
export const selectAppointmentSchema = createSelectSchema(appointments);

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;

export const createAppointmentSchema = insertAppointmentSchema.pick({
  member_id: true,
  staff_id: true,
  service_id: true,
  appointment_date: true,
  duration: true,
  notes: true,
});

export const updateAppointmentSchema = insertAppointmentSchema.partial().pick({
  staff_id: true,
  service_id: true,
  appointment_date: true,
  duration: true,
  status: true,
  total_price: true,
  notes: true,
});

export const appointmentStatusUpdateSchema = z.object({
  status: z.enum(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type AppointmentStatusUpdate = z.infer<typeof appointmentStatusUpdateSchema>;



