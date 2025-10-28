// prisma/seed/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper to generate a date/time for the slots
const getFutureDate = (days: number, hours: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hours, 0, 0, 0);
  return date;
};

async function main() {
  console.log('Start seeding...');

  // 1. Create Experiences
  const experience1 = await prisma.experience.upsert({
    where: { id: 'exp_city_tour' },
    update: {},
    create: {
      id: 'exp_city_tour',
      title: 'Historic City Walking Tour',
      description: 'Explore the hidden alleys and major landmarks with a local historian. Comfortable shoes mandatory!',
      price: 59.99,
      imageUrl: 'https://images.unsplash.com/photo-1549411930-b9df727a2068?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  });

  const experience2 = await prisma.experience.upsert({
    where: { id: 'exp_cooking_class' },
    update: {},
    create: {
      id: 'exp_cooking_class',
      title: 'Italian Pasta Making Class',
      description: 'Learn to make three authentic pasta shapes from scratch, followed by a delicious dinner.',
      price: 99.00,
      imageUrl: 'https://images.unsplash.com/photo-1546536034-7546d03d01f8?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  });

  // 2. Create Slots for Experience 1 (City Tour)
  await prisma.slot.createMany({
    data: [
      // Available slot (Tomorrow 10 AM, Capacity 10)
      { experienceId: experience1.id, startTime: getFutureDate(1, 10), endTime: getFutureDate(1, 12), capacity: 10, bookedCount: 0 },
      // Almost full slot (Day after tomorrow 2 PM, Capacity 5, 4 booked)
      { experienceId: experience1.id, startTime: getFutureDate(2, 14), endTime: getFutureDate(2, 16), capacity: 5, bookedCount: 4 },
      // Sold out slot (5 days from now 11 AM, Capacity 8, 8 booked)
      { experienceId: experience1.id, startTime: getFutureDate(5, 11), endTime: getFutureDate(5, 13), capacity: 8, bookedCount: 8 },
    ]
  });

  // 3. Create Slots for Experience 2 (Cooking Class)
  await prisma.slot.createMany({
    data: [
      { experienceId: experience2.id, startTime: getFutureDate(3, 18), endTime: getFutureDate(3, 21), capacity: 12, bookedCount: 1 },
      { experienceId: experience2.id, startTime: getFutureDate(4, 18), endTime: getFutureDate(4, 21), capacity: 12, bookedCount: 0 },
    ]
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });