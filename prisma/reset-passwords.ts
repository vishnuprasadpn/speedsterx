import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function resetPasswords() {
  console.log("Resetting passwords for all accounts...\n");

  const defaultPassword = "admin123";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  try {
    // Reset admin password
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (admin) {
      await prisma.user.update({
        where: { id: admin.id },
        data: { password: hashedPassword },
      });
      console.log("✅ Admin password reset:");
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: ${defaultPassword}\n`);
    } else {
      console.log("⚠️  No admin user found\n");
    }

    // Reset customer password
    const customer = await prisma.user.findFirst({
      where: { role: "CUSTOMER" },
    });

    if (customer) {
      await prisma.user.update({
        where: { id: customer.id },
        data: { password: hashedPassword },
      });
      console.log("✅ Customer password reset:");
      console.log(`   Email: ${customer.email}`);
      console.log(`   Password: ${defaultPassword}\n`);
    } else {
      console.log("⚠️  No customer user found\n");
    }

    // List all users
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
      },
      orderBy: { role: "asc" },
    });

    if (allUsers.length > 0) {
      console.log("📋 All accounts:");
      allUsers.forEach((user) => {
        console.log(`   - ${user.email} (${user.name}) - ${user.role}`);
      });
      console.log(`\n🔑 Default password for all accounts: ${defaultPassword}`);
    }

    console.log("\n✅ Password reset completed!");
  } catch (error: any) {
    console.error("Error resetting passwords:", error);
    throw error;
  }
}

resetPasswords()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

