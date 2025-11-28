import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminOrManager } from "@/lib/admin-permissions";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const session = await auth();
    if (!session || !isAdminOrManager(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, imageId } = await params;
    const body = await request.json();

    // Verify image belongs to product
    const image = await prisma.productImage.findFirst({
      where: {
        id: imageId,
        productId: id,
      },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Update image
    const updatedImage = await prisma.productImage.update({
      where: { id: imageId },
      data: {
        sortOrder: body.sortOrder !== undefined ? body.sortOrder : image.sortOrder,
        altText: body.altText !== undefined ? body.altText : image.altText,
      },
    });

    return NextResponse.json({ image: updatedImage });
  } catch (error: any) {
    console.error("Image update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update image" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const session = await auth();
    if (!session || !isAdminOrManager(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, imageId } = await params;

    // Verify image belongs to product
    const image = await prisma.productImage.findFirst({
      where: {
        id: imageId,
        productId: id,
      },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete file if it's a local upload
    if (image.url.startsWith("/uploads/")) {
      const filepath = join(process.cwd(), "public", image.url);
      if (existsSync(filepath)) {
        try {
          await unlink(filepath);
        } catch (error) {
          console.error("Failed to delete file:", error);
        }
      }
    }

    // Delete image record
    await prisma.productImage.delete({
      where: { id: imageId },
    });

    // Reorder remaining images
    const remainingImages = await prisma.productImage.findMany({
      where: { productId: id },
      orderBy: { sortOrder: "asc" },
    });

    for (let i = 0; i < remainingImages.length; i++) {
      await prisma.productImage.update({
        where: { id: remainingImages[i].id },
        data: { sortOrder: i },
      });
    }

    return NextResponse.json({ message: "Image deleted" });
  } catch (error: any) {
    console.error("Image delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete image" },
      { status: 500 }
    );
  }
}

