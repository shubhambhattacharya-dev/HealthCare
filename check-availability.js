const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Find the doctor
    const doctor = await prisma.user.findUnique({
        where: { email: 'shubhambhattacharya107@gmail.com' }
    });

    if (!doctor) {
        console.log("Doctor not found");
        return;
    }

    console.log("DOCTOR ID:", doctor.id);

    // Check availability
    const availability = await prisma.availability.findMany({
        where: { doctorId: doctor.id }
    });
    console.log("\nAVAILABILITY RECORDS:");
    console.log(JSON.stringify(availability, null, 2));

    // Check appointments
    const appointments = await prisma.appointment.findMany({
        where: { 
            doctorId: doctor.id,
            status: 'SCHEDULED',
            startTime: { gte: new Date() }
        },
        orderBy: { startTime: 'asc' }
    });
    console.log("\nUPCOMING SCHEDULED APPOINTMENTS:");
    console.log(JSON.stringify(appointments, null, 2));

    // Current Time info
    console.log("\nCURRENT SERVER TIME:", new Date().toISOString());
}

main();
