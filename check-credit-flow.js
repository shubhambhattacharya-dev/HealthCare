const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const appointments = await prisma.appointment.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 5,
    include: {
      patient: { select: { name: true, email: true, credits: true } },
      doctor: { select: { name: true, email: true, credits: true } }
    }
  })
  console.log("RECENT APPOINTMENTS:");
  console.log(JSON.stringify(appointments, null, 2));

  const transactions = await prisma.creditTransaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
        user: { select: { name: true, email: true } }
    }
  });
  console.log("\nRECENT TRANSACTIONS:");
  console.log(JSON.stringify(transactions, null, 2));
}

main()
