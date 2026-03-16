const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      email: true,
      plan: true,
      credits: true,
      createdAt: true
    }
  })
  console.log(JSON.stringify(users, null, 2))
}

main()
