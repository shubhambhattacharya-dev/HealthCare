const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function syncEnums() {
  console.log('--- STARTING ENUM SYNC ---');

  try {
    // Add missing values to TransactionType enum
    console.log('Syncing TransactionType enum...');
    await prisma.$executeRawUnsafe(`ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'APPOINTMENT_EARNING'`);
    await prisma.$executeRawUnsafe(`ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'PAYOUT'`);
    
    console.log('✅ Enums synced successfully.');
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('Values already exist, skipping.');
    } else {
      console.error('ERROR syncing enums:', err.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

syncEnums();
