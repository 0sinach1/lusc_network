import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash the password with a salt round of 10
  const hashedPassword = await bcrypt.hash('SuperSecretPassword123!', 10);

  // Use upsert so you can run this multiple times without crashing if the user already exists
  const superAdmin = await prisma.adminAccount.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      username: 'superadmin',
      credential: hashedPassword,
      role: 'super',
      office: 'SuperAdmin',
    },
  });

  console.log(`✅ Super Admin created successfully with username: ${superAdmin.username}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });