const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'hola@swinguer.com',
      name: 'Swinguer Admin'
    }
  });
  console.log('Usuario creado:', user);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
