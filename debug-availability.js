const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const doctors = await prisma.user.findMany({
    where: { role: 'DOCTOR' },
    select: { id: true, name: true, email: true }
  });

  console.log('Doctors:', JSON.stringify(doctors, null, 2));

  for (const doctor of doctors) {
    const availability = await prisma.availability.findMany({
      where: { doctorId: doctor.id },
    });
    console.log(`Availability for ${doctor.name}:`, JSON.stringify(availability, null, 2));
    
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
    });
    console.log(`Appointments for ${doctor.name}:`, JSON.stringify(appointments, null, 2));
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
