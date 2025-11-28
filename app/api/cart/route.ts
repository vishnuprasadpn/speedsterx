import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cartItemSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = cartItemSchema.safeParse({
      productId: body.productId,
      quantity: parseInt(body.quantity, 10),
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { productId, quantity } = validationResult.data;

    // Get product to get current price
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Insufficient stock" },
        { status: 400 }
      );
    }

    const price = Number(product.salePrice || product.price);

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        productId,
      },
    });

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          unitPriceSnapshot: price,
        },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          quantity,
          unitPriceSnapshot: price,
        },
      });
    }

    return NextResponse.json({ message: "Added to cart" });
  } catch (error: any) {
    console.error("Cart error:", error);
    
    // Don't leak internal error details
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Item already in cart" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            images: {
              orderBy: { sortOrder: "asc" },
              take: 1,
            },
          },
        },
      },
    });

    return NextResponse.json({ cartItems });
  } catch (error) {
    console.error("Cart error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

