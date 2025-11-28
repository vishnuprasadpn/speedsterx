import { PrismaClient, UserRole, ProductType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "vishnuprasad1990@gmail.com" },
    update: {},
    create: {
      email: "vishnuprasad1990@gmail.com",
      name: "Admin User",
      password: adminPassword,
      role: UserRole.ADMIN,
      phone: "+911234567890",
    },
  });
  console.log("Created admin user:", admin.email);

  // Create test customer
  const customerPassword = await bcrypt.hash("customer123", 10);
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      name: "Test Customer",
      password: customerPassword,
      role: UserRole.CUSTOMER,
      phone: "+919876543210",
    },
  });
  console.log("Created customer user:", customer.email);

  // Create secondary admin (Manager)
  const managerPassword = await bcrypt.hash("admin123", 10);
  const manager = await prisma.user.upsert({
    where: { email: "furyroadrcclub@gmail.com" },
    update: {},
    create: {
      email: "furyroadrcclub@gmail.com",
      name: "Manager",
      password: managerPassword,
      role: UserRole.MANAGER,
      phone: "+911234567891",
    },
  });
  console.log("Created manager user:", manager.email);

  // Create main category
  const carsCategory = await prisma.category.upsert({
    where: { slug: "rc-cars" },
    update: {},
    create: {
      name: "RC Cars",
      slug: "rc-cars",
      description: "Ready-to-run and kit RC cars",
      isActive: true,
    },
  });

  // Create categories from inventory
  const constructionRC = await prisma.category.upsert({
    where: { slug: "construction-rc" },
    update: {},
    create: {
      name: "Construction RC",
      slug: "construction-rc",
      description: "Construction RC vehicles including excavators, bulldozers, and more",
      isActive: true,
    },
  });

  const scaleCrawlers = await prisma.category.upsert({
    where: { slug: "scale-crawlers" },
    update: {},
    create: {
      name: "Scale Crawlers",
      slug: "scale-crawlers",
      description: "Scale crawler vehicles in various sizes",
      isActive: true,
    },
  });

  const microRC = await prisma.category.upsert({
    where: { slug: "micro-rc" },
    update: {},
    create: {
      name: "Micro RC",
      slug: "micro-rc",
      description: "Micro and mini RC vehicles",
      isActive: true,
    },
  });

  const premiumCrawlers = await prisma.category.upsert({
    where: { slug: "premium-crawlers" },
    update: {},
    create: {
      name: "Premium Crawlers",
      slug: "premium-crawlers",
      description: "Premium large-scale crawler vehicles",
      isActive: true,
    },
  });

  const accessories = await prisma.category.upsert({
    where: { slug: "accessories" },
    update: {},
    create: {
      name: "Accessories",
      slug: "accessories",
      description: "Batteries, chargers, and other accessories",
      isActive: true,
    },
  });

  console.log("Created categories");

  // Products from actual inventory CSV
  const products = [
    // Construction RC Vehicles
    {
      name: "Huina 1592",
      slug: "huina-1592",
      description: "Construction RC Excavator - High-quality remote control excavator with realistic functions.",
      price: 11999,
      stock: 2,
      categoryId: constructionRC.id,
      brand: "Huina",
      type: ProductType.OTHER,
      terrain: "Outdoor",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Huina 1592 Construction RC Excavator",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Huina 1582",
      slug: "huina-1582",
      description: "Construction RC Excavator - Premium excavator with advanced features and realistic operation.",
      price: 34500,
      salePrice: 27499,
      stock: 1,
      categoryId: constructionRC.id,
      brand: "Huina",
      type: ProductType.OTHER,
      terrain: "Outdoor",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Huina 1582 Construction RC Excavator",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Huina 1538",
      slug: "huina-1538",
      description: "Construction RC Excavator (Budget) - Affordable excavator perfect for beginners.",
      price: 19999,
      stock: 1,
      categoryId: constructionRC.id,
      brand: "Huina",
      type: ProductType.OTHER,
      terrain: "Outdoor",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Huina 1538 Construction RC Excavator",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Huina 1536",
      slug: "huina-1536",
      description: "Construction RC Bulldozer / Loader - Versatile construction vehicle with dual functionality.",
      price: 19999,
      stock: 1,
      categoryId: constructionRC.id,
      brand: "Huina",
      type: ProductType.OTHER,
      terrain: "Outdoor",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Huina 1536 Construction RC Bulldozer / Loader",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Huina 1574",
      slug: "huina-1574",
      description: "Construction RC Tower Crane - Impressive tower crane with realistic lifting capabilities.",
      price: 17999,
      stock: 0,
      categoryId: constructionRC.id,
      brand: "Huina",
      type: ProductType.OTHER,
      terrain: "Outdoor",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Huina 1574 Construction RC Tower Crane",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Huina 1583",
      slug: "huina-1583",
      description: "Construction RC Dump Truck - Large-scale dump truck with realistic dumping mechanism.",
      price: 31999,
      stock: 1,
      categoryId: constructionRC.id,
      brand: "Huina",
      type: ProductType.OTHER,
      terrain: "Outdoor",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Huina 1583 Construction RC Dump Truck",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Huina 1593",
      slug: "huina-1593",
      description: "Construction RC Excavator (Upgraded) - Enhanced excavator with premium features.",
      price: 35000,
      salePrice: 26999,
      stock: 1,
      categoryId: constructionRC.id,
      brand: "Huina",
      type: ProductType.OTHER,
      terrain: "Outdoor",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Huina 1593 Construction RC Excavator",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Huina 1594",
      slug: "huina-1594",
      description: "Construction RC Wheel Loader - Premium wheel loader with advanced controls.",
      price: 49000,
      salePrice: 37999,
      stock: 1,
      categoryId: constructionRC.id,
      brand: "Huina",
      type: ProductType.OTHER,
      terrain: "Outdoor",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Huina 1594 Construction RC Wheel Loader",
          sortOrder: 0,
        },
      ],
    },
    // Scale Crawlers
    {
      name: "FMS 1:18 FCX18 LC80 Land Cruiser 80",
      slug: "fms-1-18-fcx18-lc80-land-cruiser-80",
      description: "1:18 Scale Crawler - Detailed Land Cruiser 80 replica with excellent crawling performance.",
      price: 21999,
      stock: 1,
      categoryId: scaleCrawlers.id,
      brand: "FMS",
      scale: "1/18",
      type: ProductType.CRAWLER,
      terrain: "Mixed",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "FMS 1:18 FCX18 LC80 Land Cruiser 80",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "MN111 Defender 110 2.4G Proportional KIT Nylon Miniature 4WD",
      slug: "mn111-defender-110-kit",
      description: "Scale Crawler KIT - Build your own Defender 110 crawler with this detailed kit.",
      price: 13999,
      stock: 1,
      categoryId: scaleCrawlers.id,
      brand: "MN",
      type: ProductType.CRAWLER,
      terrain: "Mixed",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "MN111 Defender 110 Crawler KIT",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "FMS Colorado FMT24",
      slug: "fms-colorado-fmt24",
      description: "1:24 Scale Crawler - Compact Colorado crawler perfect for indoor and outdoor use.",
      price: 15999,
      stock: 3,
      categoryId: scaleCrawlers.id,
      brand: "FMS",
      scale: "1/24",
      type: ProductType.CRAWLER,
      terrain: "Mixed",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "FMS Colorado FMT24",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "FMS 1:24 Scale FCX24M Land Rover Family Camel Trophy Edition",
      slug: "fms-fcx24m-land-rover-camel-trophy",
      description: "1:24 Scale Crawler - Special edition Land Rover with Camel Trophy styling.",
      price: 13499,
      stock: 2,
      categoryId: scaleCrawlers.id,
      brand: "FMS",
      scale: "1/24",
      type: ProductType.CRAWLER,
      terrain: "Mixed",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "FMS FCX24M Land Rover Camel Trophy",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "FMS 1:24 Scale FCX24 Power Wagon",
      slug: "fms-fcx24-power-wagon",
      description: "1:24 Scale Crawler - Classic Power Wagon design with excellent crawling capabilities.",
      price: 18999,
      stock: 1,
      categoryId: scaleCrawlers.id,
      brand: "FMS",
      scale: "1/24",
      type: ProductType.CRAWLER,
      terrain: "Mixed",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "FMS FCX24 Power Wagon",
          sortOrder: 0,
        },
      ],
    },
    // Micro RC
    {
      name: "Turbo Racing C75 1:76 Scale RTR 2.4G 7km/h Max Speed",
      slug: "turbo-racing-c75",
      description: "Micro RC Car (1:76) - Ultra-compact ready-to-run car perfect for indoor racing.",
      price: 10499,
      stock: 3,
      categoryId: microRC.id,
      brand: "Turbo Racing",
      scale: "1/76",
      type: ProductType.TOURING,
      terrain: "Indoor",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Turbo Racing C75 Micro RC Car",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "WLtoys 284010 / 969 / 989",
      slug: "wltoys-284010",
      description: "Mini RC Drifter / Basher - Versatile mini RC perfect for drifting and bashing fun.",
      price: 6499,
      stock: 4,
      categoryId: microRC.id,
      brand: "WLtoys",
      type: ProductType.DRIFT,
      terrain: "Indoor",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "WLtoys 284010 Mini RC",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Wltoys 284131",
      slug: "wltoys-284131",
      description: "Mini RC Crawler - Compact crawler perfect for tight spaces and technical terrain.",
      price: 6499,
      stock: 2,
      categoryId: microRC.id,
      brand: "WLtoys",
      type: ProductType.CRAWLER,
      terrain: "Mixed",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "WLtoys 284131 Mini RC Crawler",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "WLtoys 284161",
      slug: "wltoys-284161",
      description: "Mini RC Crawler / Mini Monster - Dual-purpose mini vehicle for crawling and bashing.",
      price: 6499,
      stock: 2,
      categoryId: microRC.id,
      brand: "WLtoys",
      type: ProductType.CRAWLER,
      terrain: "Mixed",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "WLtoys 284161 Mini RC",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "SJY-K2402",
      slug: "sjy-k2402",
      description: "Mini Crawler - Affordable mini crawler perfect for beginners.",
      price: 3499,
      stock: 2,
      categoryId: microRC.id,
      brand: "SJY",
      type: ProductType.CRAWLER,
      terrain: "Mixed",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "SJY-K2402 Mini Crawler",
          sortOrder: 0,
        },
      ],
    },
    // Premium Crawlers
    {
      name: "Traction Hobby KM GWM Tank 300 1:8 Scale RC Crawler Truck",
      slug: "traction-hobby-km-tank-300",
      description: "Premium Large-Scale Crawler (1:8) - High-end 1:8 scale crawler with exceptional detail and performance.",
      price: 119999,
      stock: 1,
      categoryId: premiumCrawlers.id,
      brand: "Traction Hobby",
      scale: "1/8",
      type: ProductType.CRAWLER,
      terrain: "Outdoor",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Traction Hobby KM GWM Tank 300",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "KM3299",
      slug: "km3299",
      description: "High-End Crawler Chassis / Truck - Premium crawler chassis for serious enthusiasts.",
      price: 5999,
      stock: 6,
      categoryId: premiumCrawlers.id,
      brand: "KM",
      type: ProductType.CRAWLER,
      terrain: "Outdoor",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "KM3299 Crawler Chassis",
          sortOrder: 0,
        },
      ],
    },
    // Accessories - Batteries
    {
      name: "Battery 1592",
      slug: "battery-1592",
      description: "Battery for Huina 1592 Construction RC Excavator.",
      price: 799,
      stock: 2,
      categoryId: accessories.id,
      brand: "Huina",
      type: ProductType.OTHER,
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Battery 1592",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Battery 1582 & 1583",
      slug: "battery-1582-1583",
      description: "Battery compatible with Huina 1582 and 1583 models.",
      price: 1299,
      stock: 6,
      categoryId: accessories.id,
      brand: "Huina",
      type: ProductType.OTHER,
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Battery 1582 & 1583",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Battery 1593",
      slug: "battery-1593",
      description: "Battery for Huina 1593 Construction RC Excavator.",
      price: 1299,
      stock: 2,
      categoryId: accessories.id,
      brand: "Huina",
      type: ProductType.OTHER,
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Battery 1593",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Battery (FMS FCX18)",
      slug: "battery-fms-fcx18",
      description: "Battery for FMS FCX18 scale crawler.",
      price: 1999,
      stock: 2,
      categoryId: accessories.id,
      brand: "FMS",
      type: ProductType.OTHER,
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Battery FMS FCX18",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Battery (MN111)",
      slug: "battery-mn111",
      description: "Battery for MN111 Defender 110 crawler kit.",
      price: 1299,
      stock: 2,
      categoryId: accessories.id,
      brand: "MN",
      type: ProductType.OTHER,
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Battery MN111",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Battery (FMS Colorado)",
      slug: "battery-fms-colorado",
      description: "Battery for FMS Colorado FMT24 scale crawler.",
      price: 1999,
      stock: 4,
      categoryId: accessories.id,
      brand: "FMS",
      type: ProductType.OTHER,
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Battery FMS Colorado",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Battery (FMS FCX24M)",
      slug: "battery-fms-fcx24m",
      description: "Battery for FMS FCX24M Land Rover scale crawler.",
      price: 1599,
      stock: 6,
      categoryId: accessories.id,
      brand: "FMS",
      type: ProductType.OTHER,
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Battery FMS FCX24M",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Battery (FCX24 Power Wagon)",
      slug: "battery-fcx24-power-wagon",
      description: "Battery for FMS FCX24 Power Wagon scale crawler.",
      price: 1599,
      stock: 2,
      categoryId: accessories.id,
      brand: "FMS",
      type: ProductType.OTHER,
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Battery FCX24 Power Wagon",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Battery (Traction Hobby KM)",
      slug: "battery-traction-hobby-km",
      description: "Battery for Traction Hobby KM GWM Tank 300 crawler.",
      price: 8999,
      stock: 1,
      categoryId: accessories.id,
      brand: "Traction Hobby",
      type: ProductType.OTHER,
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Battery Traction Hobby KM",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "Battery (KM3299)",
      slug: "battery-km3299",
      description: "Battery for KM3299 crawler chassis.",
      price: 799,
      stock: 10,
      categoryId: accessories.id,
      brand: "KM",
      type: ProductType.OTHER,
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Battery KM3299",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "WLtoys 284010 extra battery",
      slug: "wltoys-284010-extra-battery",
      description: "Extra battery for WLtoys 284010 mini RC.",
      price: 799,
      stock: 6,
      categoryId: accessories.id,
      brand: "WLtoys",
      type: ProductType.OTHER,
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "WLtoys 284010 Extra Battery",
          sortOrder: 0,
        },
      ],
    },
    {
      name: "SJY-K2402 extra battery",
      slug: "sjy-k2402-extra-battery",
      description: "Extra battery for SJY-K2402 mini crawler.",
      price: 499,
      stock: 10,
      categoryId: accessories.id,
      brand: "SJY",
      type: ProductType.OTHER,
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "SJY-K2402 Extra Battery",
          sortOrder: 0,
        },
      ],
    },
    // Accessories - Chargers
    {
      name: "Charger (Traction Hobby KM)",
      slug: "charger-traction-hobby-km",
      description: "Charger for Traction Hobby KM GWM Tank 300 crawler battery.",
      price: 3999,
      stock: 1,
      categoryId: accessories.id,
      brand: "Traction Hobby",
      type: ProductType.OTHER,
      images: [
        {
          url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop&q=80",
          altText: "Charger Traction Hobby KM",
          sortOrder: 0,
        },
      ],
    },
  ];

  for (const productData of products) {
    const { images, ...productInfo } = productData;
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productInfo,
    });

    // Delete existing images and create new ones
    await prisma.productImage.deleteMany({
      where: { productId: product.id },
    });

    // Create images
    for (const imageData of images) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          ...imageData,
        },
      });
    }
  }

  console.log("Created products from inventory");

  // Create sample pages
  const pages = [
    {
      slug: "about",
      title: "About Us",
      content:
        "SpeedsterX is India's premier destination for RC cars. We offer a wide selection of high-quality RC vehicles for enthusiasts of all levels.",
      isPublished: true,
    },
    {
      slug: "shipping",
      title: "Shipping & Returns",
      content:
        "We offer fast and reliable shipping across India. Standard shipping takes 3-5 business days. Free shipping on orders above ₹5000. Returns accepted within 7 days of delivery.",
      isPublished: true,
    },
    {
      slug: "faq",
      title: "Frequently Asked Questions",
      content:
        "Q: What is the warranty on RC cars?\nA: Most products come with manufacturer warranty. Please check product details.\n\nQ: Do you offer spare parts?\nA: Yes, we stock a wide range of spare parts and accessories.",
      isPublished: true,
    },
    {
      slug: "contact",
      title: "Contact Us",
      content:
        "Email: support@speedsterx.com\nPhone: +91-1234567890\nAddress: 123 RC Street, Mumbai, Maharashtra 400001",
      isPublished: true,
    },
  ];

  for (const pageData of pages) {
    await prisma.page.upsert({
      where: { slug: pageData.slug },
      update: {},
      create: pageData,
    });
  }

  console.log("Created sample pages");
  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
