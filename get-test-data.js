const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const doctor = await prisma.user.findFirst({
    where: { role: 'DOCTOR' }
  });

  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  const appointments = await prisma.appointment.findMany({
    where: {
      status: 'SCHEDULED'
    },
    take: 5
  });

  console.log('--- TEST DATA ---');
  console.log(JSON.stringify({ doctor, admin, appointments }, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
