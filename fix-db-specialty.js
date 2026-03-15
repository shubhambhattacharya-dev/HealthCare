const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const update = await prisma.user.updateMany({
      where: {
        specialty: 'GeneralMedicine'
      },
      data: {
        specialty: 'General Medicine'
      }
    });

    console.log("Updated records:", update.count);

  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
