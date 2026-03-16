const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const doctorId = '947f238f-5ab6-44b3-95b2-56dd5c41dbdb';
  const doctor = await prisma.user.findUnique({
    where: { id: doctorId },
  });

  if (!doctor) {
    console.log('Doctor not found');
    return;
  }

  console.log('Doctor:', doctor.id, doctor.name);

  const availability = await prisma.availability.findMany({
    where: { doctorId: doctor.id },
  });
  console.log('Availability:', JSON.stringify(availability, null, 2));
  
  const appointments = await prisma.appointment.findMany({
    where: { 
      doctorId: doctor.id,
      status: 'SCHEDULED'
    },
  });
  console.log('Scheduled Appointments:', JSON.stringify(appointments, null, 2));

  const now = new Date();
  console.log('Server time (UTC):', now.toISOString());
  console.log('Local time (Indian):', new Date(now.getTime() + (5.5 * 60 * 60 * 1000)).toISOString());
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
