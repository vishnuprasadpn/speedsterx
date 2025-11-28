import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function updateAdminEmail() {
  console.log("Updating admin email...");

  try {
    // Find existing admin user
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!existingAdmin) {
      console.log("No admin user found. Creating new admin...");
      const adminPassword = await bcrypt.hash("admin123", 10);
      const admin = await prisma.user.create({
        data: {
          email: "vishnuprasad1990@gmail.com",
          name: "Admin User",
          password: adminPassword,
          role: "ADMIN",
          phone: "+911234567890",
        },
      });
      console.log("✅ Created admin user:", admin.email);
      return;
    }

    // Update existing admin email
    const updatedAdmin = await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        email: "vishnuprasad1990@gmail.com",
      },
    });

    console.log("✅ Updated admin email to:", updatedAdmin.email);
    console.log("   Previous email was:", existingAdmin.email);
  } catch (error: any) {
    console.error("Error updating admin email:", error);
    throw error;
  }
}

updateAdminEmail()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

