const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    select: {
      email: true,
      plan: true,
      credits: true,
    }
  })
  console.log(JSON.stringify(users, null, 2))
}

main()
