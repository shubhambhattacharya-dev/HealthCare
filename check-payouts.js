const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const doctors = await prisma.user.findMany({
    where: { role: 'DOCTOR' },
    select: { id: true, name: true, email: true, credits: true, verificationStatus: true }
  });

  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true, name: true, email: true }
  });

  const pendingPayouts = await prisma.payout.findMany({
    where: { status: 'PROCESSING' },
    include: { doctor: { select: { name: true } } }
  });

  const appointments = await prisma.appointment.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  console.log(JSON.stringify({ doctors, admins, pendingPayouts, appointments }, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
