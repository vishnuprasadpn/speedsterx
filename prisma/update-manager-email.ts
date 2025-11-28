import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateManagerEmail() {
  console.log("Updating manager email...\n");

  try {
    // Find the manager user
    const manager = await prisma.user.findFirst({
      where: { role: "MANAGER" },
    });

    if (!manager) {
      console.log("⚠️  No manager user found. Creating new manager...");
      
      const bcrypt = require("bcryptjs");
      const managerPassword = await bcrypt.hash("admin123", 10);
      
      const newManager = await prisma.user.create({
        data: {
          email: "furyroadrcclub@gmail.com",
          name: "Manager",
          password: managerPassword,
          role: "MANAGER",
          phone: "+911234567891",
        },
      });
      
      console.log("✅ Manager created:");
      console.log(`   Email: ${newManager.email}`);
      console.log(`   Password: admin123`);
      return;
    }

    // Update manager email
    const updatedManager = await prisma.user.update({
      where: { id: manager.id },
      data: { email: "furyroadrcclub@gmail.com" },
    });

    console.log("✅ Manager email updated:");
    console.log(`   Old Email: ${manager.email}`);
    console.log(`   New Email: ${updatedManager.email}`);
    console.log(`   Password: admin123`);
  } catch (error: any) {
    console.error("Error updating manager email:", error);
    throw error;
  }
}

updateManagerEmail()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

