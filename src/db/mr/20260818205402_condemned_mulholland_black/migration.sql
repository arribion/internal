-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "admins" (
	"id" serial PRIMARY KEY,
	"email" text CONSTRAINT "admins_email_unique" UNIQUE,
	"password" text
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" serial PRIMARY KEY,
	"title" text,
	"category" text CONSTRAINT "blogs_category_unique" UNIQUE,
	"description" text,
	"cover-image" text,
	"tags" text,
	"content" text,
	"likes" text,
	"comments" text,
	"author-role" text,
	"author_id" serial
);
--> statement-breakpoint
CREATE TABLE "contact" (
	"id" serial PRIMARY KEY,
	"name" text,
	"email" text CONSTRAINT "contact_email_unique" UNIQUE,
	"company-name" text,
	"subject" text,
	"support-file" text,
	"message" text
);
--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" serial PRIMARY KEY,
	"title" text,
	"description" text,
	"image" text,
	"author-role" text,
	"author_id" serial
);
--> statement-breakpoint
CREATE TABLE "newsletter" (
	"id" serial PRIMARY KEY,
	"email" text CONSTRAINT "newsletter_email_unique" UNIQUE
);
--> statement-breakpoint
CREATE TABLE "portfolio_projects" (
	"id" serial,
	"title" text,
	"description" text,
	"cover_image" text,
	"tags" text,
	"github_url" text,
	"live_url" text,
	"thumbnail" text,
	CONSTRAINT "projects_pkey" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" serial PRIMARY KEY,
	"name" text,
	"role" text,
	"profile-image" text,
	"linkedin-link" text,
	"twitter-link" text,
	"github-link" text,
	"email" text CONSTRAINT "team_email_unique" UNIQUE,
	"author-role" text,
	"author_id" serial
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"name" text,
	"email" text CONSTRAINT "users_email_unique" UNIQUE,
	"password" text
);
--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author-role_admins_email_fk" FOREIGN KEY ("author-role") REFERENCES "admins"("email");--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_author-role_admins_email_fk" FOREIGN KEY ("author-role") REFERENCES "admins"("email");--> statement-breakpoint
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_author-role_admins_email_fk" FOREIGN KEY ("author-role") REFERENCES "admins"("email");--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "users"("id");
*/