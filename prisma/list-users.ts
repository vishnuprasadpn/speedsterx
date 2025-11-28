import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function listUsers() {
  console.log("📋 All Login Accounts:\n");

  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        phone: true,
      },
      orderBy: [
        { role: "asc" },
        { email: "asc" },
      ],
    });

    if (users.length === 0) {
      console.log("No users found in the database.");
      return;
    }

    console.log("Default Password: admin123 (for all accounts)\n");
    console.log("─".repeat(60));

    users.forEach((user, index) => {
      const roleBadge = 
        user.role === "ADMIN" ? "🔴 ADMIN" :
        user.role === "MANAGER" ? "🔵 MANAGER" :
        "🟢 CUSTOMER";

      console.log(`\n${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${roleBadge}`);
      if (user.phone) {
        console.log(`   Phone: ${user.phone}`);
      }
    });

    console.log("\n" + "─".repeat(60));
    console.log(`\nTotal: ${users.length} account(s)`);
    console.log("\n🔑 Password for all accounts: admin123\n");
  } catch (error: any) {
    console.error("Error listing users:", error);
    throw error;
  }
}

listUsers()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

