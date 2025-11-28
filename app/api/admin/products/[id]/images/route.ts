import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminOrManager } from "@/lib/admin-permissions";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !isAdminOrManager(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const contentType = request.headers.get("content-type");
    
    // Handle JSON (URL-based image)
    if (contentType?.includes("application/json")) {
      const body = await request.json();
      const { url, altText } = body;

      if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
      }

      // Get max sortOrder
      const maxSortOrder = product.images.length > 0
        ? Math.max(...product.images.map((img) => img.sortOrder))
        : -1;

      const image = await prisma.productImage.create({
        data: {
          productId: id,
          url: url.trim(),
          altText: altText?.trim() || product.name,
          sortOrder: maxSortOrder + 1,
        },
      });

      return NextResponse.json({ image }, { status: 201 });
    }

    // Handle FormData (file upload)
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "products");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const uploadedImages = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        continue;
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split(".").pop() || "jpg";
      const filename = `${id}-${timestamp}-${randomStr}.${extension}`;
      const filepath = join(uploadsDir, filename);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      // Get max sortOrder
      const maxSortOrder = product.images.length > 0
        ? Math.max(...product.images.map((img) => img.sortOrder))
        : -1;

      // Create image record
      const image = await prisma.productImage.create({
        data: {
          productId: id,
          url: `/uploads/products/${filename}`,
          altText: product.name,
          sortOrder: maxSortOrder + uploadedImages.length + 1,
        },
      });

      uploadedImages.push(image);
    }

    return NextResponse.json({ images: uploadedImages }, { status: 201 });
  } catch (error: any) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload images" },
      { status: 500 }
    );
  }
}

