import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Valid product slugs from the CSV inventory
const validProductSlugs = [
  "huina-1592",
  "huina-1582",
  "huina-1538",
  "huina-1536",
  "huina-1574",
  "huina-1583",
  "huina-1593",
  "huina-1594",
  "fms-1-18-fcx18-lc80-land-cruiser-80",
  "mn111-defender-110-kit",
  "fms-colorado-fmt24",
  "fms-fcx24m-land-rover-camel-trophy",
  "fms-fcx24-power-wagon",
  "turbo-racing-c75",
  "wltoys-284010",
  "wltoys-284131",
  "wltoys-284161",
  "sjy-k2402",
  "traction-hobby-km-tank-300",
  "km3299",
  "battery-1592",
  "battery-1582-1583",
  "battery-1593",
  "battery-fms-fcx18",
  "battery-mn111",
  "battery-fms-colorado",
  "battery-fms-fcx24m",
  "battery-fcx24-power-wagon",
  "battery-traction-hobby-km",
  "battery-km3299",
  "wltoys-284010-extra-battery",
  "sjy-k2402-extra-battery",
  "charger-traction-hobby-km",
];

async function cleanup() {
  console.log("Cleaning up demo products...");

  // Get all products
  const allProducts = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  console.log(`Found ${allProducts.length} products in database`);

  // Find products that are NOT in the valid list
  const productsToDelete = allProducts.filter(
    (product) => !validProductSlugs.includes(product.slug)
  );

  if (productsToDelete.length === 0) {
    console.log("✅ No demo products found. All products are from inventory.");
    return;
  }

  console.log(`\nFound ${productsToDelete.length} demo products to delete:`);
  productsToDelete.forEach((product) => {
    console.log(`  - ${product.name} (${product.slug})`);
  });

  // Delete product images first (cascade should handle this, but being explicit)
  for (const product of productsToDelete) {
    await prisma.productImage.deleteMany({
      where: { productId: product.id },
    });
  }

  // Delete products
  const deleteResult = await prisma.product.deleteMany({
    where: {
      slug: {
        notIn: validProductSlugs,
      },
    },
  });

  console.log(`\n✅ Deleted ${deleteResult.count} demo products`);
  console.log(`✅ Kept ${allProducts.length - deleteResult.count} inventory products`);
  console.log("\nCleanup completed!");
}

cleanup()
  .catch((e) => {
    console.error("Error during cleanup:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

