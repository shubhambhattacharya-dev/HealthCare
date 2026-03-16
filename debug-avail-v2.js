const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const doctor = await prisma.user.findFirst({
    where: { name: 'Dr. Shubham Bhattacharya' },
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
  console.log('Server time (Local):', now.toString());
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
