const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      plan: true,
      credits: true,
      role: true
    }
  })
  fs.writeFileSync('user.json', JSON.stringify(users, null, 2))
}

main()
