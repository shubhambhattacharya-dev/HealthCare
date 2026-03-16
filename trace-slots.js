const { PrismaClient } = require('@prisma/client')
const { addDays, addMinutes, format, isBefore, endOfDay } = require("date-fns");
const prisma = new PrismaClient()

async function main() {
    const doctorId = "947f238f-5ab6-44b3-95b2-56dd5c41dbdb";
    const doctor = await prisma.user.findUnique({
        where: { id: doctorId }
    });

    const availability = await prisma.availability.findFirst({
        where: { doctorId: doctor.id, status: "AVAILABLE" }
    });

    console.log("AVAILABILITY:", availability.startTime.toISOString(), "to", availability.endTime.toISOString());

    const now = new Date(); // March 16 ~18:50 UTC
    console.log("NOW (UTC):", now.toISOString());

    const days = [now, addDays(now, 1), addDays(now, 2), addDays(now, 3)];

    const existingAppointments = await prisma.appointment.findMany({
        where: {
            doctorId,
            status: "SCHEDULED",
            startTime: { gte: now, lte: endOfDay(days[3]) }
        }
    });

    const result = [];

    for (const day of days) {
        const dayString = format(day, "yyyy-MM-dd");
        console.log(`\nGENERATING FOR DAY: ${dayString}`);
        
        const availabilityStart = new Date(availability.startTime);
        const availabilityEnd = new Date(availability.endTime);

        availabilityStart.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
        availabilityEnd.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());

        console.log(`  Target Window: ${availabilityStart.toISOString()} to ${availabilityEnd.toISOString()}`);

        let current = new Date(availabilityStart);
        const end = new Date(availabilityEnd);

        const daySlots = [];
        while (isBefore(addMinutes(current, 30), end) || +addMinutes(current, 30) === +end) {
            const next = addMinutes(current, 30);
            
            if (isBefore(current, now)) {
                // console.log(`    Skipping past slot: ${current.toISOString()}`);
                current = next;
                continue;
            }

            daySlots.push({
                startTime: current.toISOString(),
                formatted: format(current, "h:mm a"),
            });
            current = next;
        }
        result.push({ date: dayString, slots: daySlots });
    }

    console.log("\nFINAL GENERATED DAYS:");
    result.forEach(d => {
        console.log(`${d.date}: ${d.slots.length} slots`);
        d.slots.forEach(s => console.log(`  - ${s.startTime} (${s.formatted})`));
    });
}

main();
