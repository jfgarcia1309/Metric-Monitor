import { type User, type InsertUser, type Manager, type InsertManager } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Manager CRUD
  getManagers(): Promise<Manager[]>;
  getManagersByWeek(week: number): Promise<Manager[]>;
  createManager(manager: InsertManager): Promise<Manager>;
  updateManager(id: string, manager: Partial<InsertManager>): Promise<Manager>;
  deleteManager(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private managers: Map<string, Manager>;

  constructor() {
    this.users = new Map();
    this.managers = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getManagers(): Promise<Manager[]> {
    return Array.from(this.managers.values());
  }

  async getManagersByWeek(week: number): Promise<Manager[]> {
    return Array.from(this.managers.values()).filter(m => m.semana === week);
  }

  async createManager(insertManager: InsertManager): Promise<Manager> {
    const id = randomUUID();
    const manager: Manager = { ...insertManager, id };
    this.managers.set(id, manager);
    return manager;
  }

  async updateManager(id: string, update: Partial<InsertManager>): Promise<Manager> {
    const existing = this.managers.get(id);
    if (!existing) throw new Error("Manager not found");
    const updated = { ...existing, ...update };
    this.managers.set(id, updated);
    return updated;
  }

  async deleteManager(id: string): Promise<void> {
    this.managers.delete(id);
  }
}

export const storage = new MemStorage();
