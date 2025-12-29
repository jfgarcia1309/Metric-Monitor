import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const managers = pgTable("managers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  renovaciones: integer("renovaciones").notNull().default(0),
  calidad: real("calidad").notNull().default(0),
  atrasos: real("atrasos").notNull().default(0),
  llamadas: integer("llamadas").notNull().default(0),
  conectividad: integer("conectividad").notNull().default(70),
  semana: integer("semana").notNull().default(1), // 1, 2, 3, 4
});

export const insertManagerSchema = createInsertSchema(managers).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Manager = typeof managers.$inferSelect;
export type InsertManager = z.infer<typeof insertManagerSchema>;
