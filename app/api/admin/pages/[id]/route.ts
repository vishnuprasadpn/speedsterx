import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminOrManager } from "@/lib/admin-permissions";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !isAdminOrManager(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if page exists
    const page = await prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Delete the page
    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Page deleted successfully" });
  } catch (error: any) {
    console.error("Page delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete page" },
      { status: 500 }
    );
  }
}

