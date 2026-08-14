import { NextResponse } from "next/server";
import { db } from "@/db";
import { portfolioProjects } from "@/db/schema";
import { desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const projects = await db.select().from(portfolioProjects).orderBy(desc(portfolioProjects.createdAt));
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = uuidv4();

    const newProject = await db
      .insert(portfolioProjects)
      .values({
        id,
        title: body.title || "Untitled Project",
        description: body.description || "",
        thumbnail: body.thumbnail || null,
        liveUrl: body.liveUrl || null,
        githubUrl: body.githubUrl || null,
        tags: body.tags || [],
        category: body.category || null,
        featured: body.featured || false,
        status: body.status || "draft",
      })
      .returning();

    return NextResponse.json(newProject[0], { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
