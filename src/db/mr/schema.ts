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
    authorRole: text("author_role"),
    authorId: serial("author_id").notNull()
  },
  (table) => [unique("blogs_category_unique").on(table.category)],
);