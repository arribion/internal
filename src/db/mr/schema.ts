import {
  pgTable,
  serial,
  text,
  foreignKey,
  primaryKey,
  unique,
  boolean,
  jsonb,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const admins = pgTable(
  "admins",
  {
    id: serial().primaryKey(),
    email: text(),
    password: text(),
  },
  (table) => [unique("admins_email_unique").on(table.email)],
);

export const blogs = pgTable(
  "blogs",
  {
    id: serial().primaryKey(),
    title: text(),
    category: text(),
    description: text(),
    coverImage: text("cover_image"),
    tags: text(),
    content: text(),
    likes: text(),
    comments: text(),
    authorRole: text("author_role").references(() => admins.email),
    authorId: serial("author_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => [unique("blogs_category_unique").on(table.category)],
);

export const contact = pgTable(
  "contact",
  {
    id: serial().primaryKey(),
    name: text(),
    email: text(),
    companyName: text("company_name"),
    subject: text(),
    supportFile: text("support_file"),
    message: text(),
  },
  (table) => [unique("contact_email_unique").on(table.email)],
);

export const gallery = pgTable("gallery", {
  id: serial().primaryKey(),
  title: text(),
  description: text(),
  image: text(),
  authorRole: text("author_role").references(() => admins.email),
  authorId: serial("author_id")
    .notNull()
    .references(() => users.id),
});

export const newsletter = pgTable(
  "newsletter",
  {
    id: serial().primaryKey(),
    email: text(),
  },
  (table) => [unique("newsletter_email_unique").on(table.email)],
);

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

export const team = pgTable(
  "team",
  {
    id: serial().primaryKey(),
    name: text(),
    role: text(),
    profileImage: text("profile_image"),
    linkedinLink: text("linkedin_link"),
    twitterLink: text("twitter_link"),
    githubLink: text("github_link"),
    email: text(),
    authorRole: text("author_role").references(() => admins.email),
    authorId: serial("author_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => [unique("team_email_unique").on(table.email)],
);

export const users = pgTable(
  "users",
  {
    id: serial().primaryKey(),
    name: text(),
    email: text(),
    password: text(),
  },
  (table) => [unique("users_email_unique").on(table.email)],
);
