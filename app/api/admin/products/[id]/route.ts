import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminOrManager } from "@/lib/admin-permissions";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !isAdminOrManager(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description || null,
        price: body.price,
        salePrice: body.salePrice || null,
        stock: body.stock,
        isActive: body.isActive,
        categoryId: body.categoryId,
        brand: body.brand || null,
        scale: body.scale || null,
        type: body.type || null,
        motorType: body.motorType || null,
        batteryType: body.batteryType || null,
        terrain: body.terrain || null,
      },
    });

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

