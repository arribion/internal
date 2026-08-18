import { NextResponse } from "next/server";
import { db } from "@/db";
import { blogs } from "@/db/schema/schema";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const allBlogs = await db
      .select()
      .from(blogs)
      .orderBy(desc(blogs.createdAt));
    return NextResponse.json(allBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = uuidv4();
    const slug =
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      id.slice(0, 8);

    const wordCount = body.content?.split(/\s+/).length || 0;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    const newBlog = await db
      .insert(blogs)
      .values({
        id,
        title: body.title || "Untitled",
        slug,
        excerpt: body.excerpt || "",
        content: body.content || "",
        coverImage: body.coverImage || null,
        tags: body.tags || [],
        category: body.category || null,
        status: body.status || "draft",
        author: body.author || "Arribion",
        readTime,
        featured: body.featured || false,
        publishedAt: body.status === "published" ? new Date() : null,
      })
      .returning();

    return NextResponse.json(newBlog[0], { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 },
    );
  }
}
