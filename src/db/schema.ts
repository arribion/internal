import { pgTable, text, timestamp, boolean, varchar, jsonb } from "drizzle-orm/pg-core";

export const blogs = pgTable("blogs", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: text("title").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  tags: jsonb("tags").$type<string[]>().default([]),
  category: varchar("category", { length: 100 }),
  status: varchar("status", { length: 20 }).default("draft"), // draft, published
  author: varchar("author", { length: 100 }).default("Arribion"),
  readTime: varchar("read_time", { length: 20 }),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  publishedAt: timestamp("published_at"),
});

export const portfolioProjects = pgTable("portfolio_projects", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail"),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  tags: jsonb("tags").$type<string[]>().default([]),
  category: varchar("category", { length: 100 }),
  featured: boolean("featured").default(false),
  status: varchar("status", { length: 20 }).default("draft"), // draft, published
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;
export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type NewPortfolioProject = typeof portfolioProjects.$inferInsert;
