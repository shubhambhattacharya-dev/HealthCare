const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function testPayoutFlow() {
  let log = '--- STARTING PAYOUT FLOW TEST ---\n';

  try {
    // 1. Find a doctor
    const doctor = await prisma.user.findFirst({
      where: { role: 'DOCTOR' }
    });

    if (!doctor) {
      log += 'No doctor found\n';
      fs.writeFileSync('test-error.log', log);
      return;
    }

    log += `Initial Credits for Dr. ${doctor.name}: ${doctor.credits}\n`;

    // 2. Create a Payout Request (Simulating requestPayout action)
    const creditCount = 5; // Test with 5 credits
    const CREDIT_VALUE = 10;
    const PLATFORM_FEE_PER_CREDIT = 2;
    const DOCTOR_EARNINGS_PER_CREDIT = 8;

    const totalAmount = creditCount * CREDIT_VALUE;
    const platformFee = creditCount * PLATFORM_FEE_PER_CREDIT;
    const netAmount = creditCount * DOCTOR_EARNINGS_PER_CREDIT;

    log += `Requesting Payout for ${creditCount} credits ($${netAmount} net)...\n`;

    const payout = await prisma.payout.create({
      data: {
        doctorId: doctor.id,
        amount: totalAmount,
        credits: creditCount,
        platformFee,
        netAmount,
        payoutEmail: 'test-payout@example.com',
        status: 'PROCESSING',
      },
    });

    log += `Payout Requested. ID: ${payout.id}, Status: ${payout.status}\n`;

    // 3. Process the Payout (Simulating updatePayoutStatus action - PROCESSED)
    log += 'Admin Approving Payout...\n';

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

    log += `Payout Processed. ID: ${result.id}, Status: ${result.status}\n`;

    // 4. Verify results
    const finalDoctor = await prisma.user.findUnique({
      where: { id: doctor.id }
    });

    log += `Final Credits for Dr. ${doctor.name}: ${finalDoctor.credits}\n`;
    log += `Expected Credits: ${doctor.credits - creditCount}\n`;

    if (finalDoctor.credits === doctor.credits - creditCount) {
      log += '✅ TEST PASSED: Credits correctly deducted.\n';
    } else {
      log += '❌ TEST FAILED: Credit mismatch.\n';
    }

  } catch (err) {
    log += 'ERROR: ' + err.message + '\n';
    log += 'STACK: ' + err.stack + '\n';
  }

  fs.writeFileSync('test-payout.log', log);
  console.log('Results written to test-payout.log');
}

testPayoutFlow()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
