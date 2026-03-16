const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testPayoutFlow() {
  console.log('--- STARTING PAYOUT FLOW TEST ---');

  // 1. Find a doctor
  const doctor = await prisma.user.findFirst({
    where: { role: 'DOCTOR' }
  });

  if (!doctor) {
    console.error('No doctor found');
    return;
  }

  console.log(`Initial Credits for Dr. ${doctor.name}: ${doctor.credits}`);

  // 2. Create a Payout Request (Simulating requestPayout action)
  const creditCount = 5; // Test with 5 credits
  const CREDIT_VALUE = 10;
  const PLATFORM_FEE_PER_CREDIT = 2;
  const DOCTOR_EARNINGS_PER_CREDIT = 8;

  const totalAmount = creditCount * CREDIT_VALUE;
  const platformFee = creditCount * PLATFORM_FEE_PER_CREDIT;
  const netAmount = creditCount * DOCTOR_EARNINGS_PER_CREDIT;

  console.log(`Requesting Payout for ${creditCount} credits ($${netAmount} net)...`);

  const payout = await prisma.payout.create({
    data: {
      doctorId: doctor.id,
      amount: totalAmount,
      credits: creditCount,
      platformFee,
      netAmount,
      paypalEmail: 'test-payout@example.com',
      status: 'PROCESSING',
    },
  });

  console.log(`Payout Requested. ID: ${payout.id}, Status: ${payout.status}`);

  // 3. Process the Payout (Simulating updatePayoutStatus action - PROCESSED)
  console.log('Admin Approving Payout...');

  const result = await prisma.$transaction(async (tx) => {
    // Update payout status
    const updatedPayout = await tx.payout.update({
      where: { id: payout.id },
      data: {
        status: 'PROCESSED',
        processedAt: new Date(),
      },
    });

    // Deduct credits from doctor
    await tx.user.update({
      where: { id: doctor.id },
      data: {
        credits: {
          decrement: creditCount
        }
      }
    });

    // Create a credit transaction record
    await tx.creditTransaction.create({
      data: {
        userId: doctor.id,
        amount: -creditCount,
        type: 'PAYOUT',
        referenceId: payout.id,
        description: `Test Payout processed for ${creditCount} credits`,
      }
    });

    return updatedPayout;
  });

  console.log(`Payout Processed. ID: ${result.id}, Status: ${result.status}`);

  // 4. Verify results
  const finalDoctor = await prisma.user.findUnique({
    where: { id: doctor.id }
  });

  console.log(`Final Credits for Dr. ${doctor.name}: ${finalDoctor.credits}`);
  console.log(`Expected Credits: ${doctor.credits - creditCount}`);

  if (finalDoctor.credits === doctor.credits - creditCount) {
    console.log('✅ TEST PASSED: Credits correctly deducted.');
  } else {
    console.log('❌ TEST FAILED: Credit mismatch.');
  }

  // Cleanup: Delete the test payout and transaction to avoid polluting DB
  // Or maybe keep it for user to see? User asked for testing.
  // I'll keep it for now as "Proof of Test".
}

testPayoutFlow()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
