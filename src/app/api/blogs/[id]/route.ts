import { NextResponse } from "next/server";
import { db } from "@/db";
import { blogs } from "@/db/schema/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const blog = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);

    if (blog.length === 0) {
      return NextResponse.json(
        {
          error: "Blog not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(blog[0]);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const wordCount = body.content?.split(/\s+/).length || 0;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    const updated = await db
      .update(blogs)
      .set({
        ...body,
        readTime,
        updatedAt: new Date(),
        publishedAt: body.status === "published" ? new Date() : undefined,
      })
      .where(eq(blogs.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deleted = await db.delete(blogs).where(eq(blogs.id, id)).returning();
    if (deleted.length === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Blog deleted" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 },
    );
  }
}
