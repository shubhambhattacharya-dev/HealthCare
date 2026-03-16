const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const doctorId = '947f238f-5ab6-44b3-95b2-56dd5c41dbdb';
  const availability = await prisma.availability.findMany({ where: { doctorId } });
  const appointments = await prisma.appointment.findMany({ 
    where: { doctorId, status: 'SCHEDULED' },
    select: { startTime: true, endTime: true }
  });

  console.log('AVAILABILITY:');
  availability.forEach(a => console.log(`  ${a.startTime.toISOString()} - ${a.endTime.toISOString()}`));
  
  console.log('SCHEDULED APPOINTMENTS:');
  appointments.forEach(a => console.log(`  ${a.startTime.toISOString()} - ${a.endTime.toISOString()}`));

  console.log('SERVER NOW (UTC):', new Date().toISOString());
}

main().finally(() => prisma.$disconnect());
