const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'yesiamcreator7@gmail.com' },
    select: {
      id: true,
      email: true,
      plan: true,
      credits: true,
      clerkUserId: true,
      role: true,
      creditTransactions: {
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  })
  console.log(JSON.stringify(user, null, 2))
}

main()
