import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  const hash = await bcrypt.hash('password123', 10);
  const users = [
    { email: 'alex@swp.com', name: 'Alex', plan: 'ELITE' },
    { email: 'maria@swp.com', name: 'María', plan: 'ADVANCED' },
    { email: 'david@swp.com', name: 'David', plan: 'PRO' },
    { email: 'sofia@swp.com', name: 'Sofía', plan: 'DIAMANTE' },
    { email: 'carlos@swp.com', name: 'Carlos', plan: 'FREE' }
  ];
  for (const u of users) {
    await prisma.user.upsert({ where: { email: u.email }, update: {}, create: { ...u, password: hash } });
  }
  console.log('✅ 5 usuarios creados');
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
