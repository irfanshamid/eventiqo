import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create User
  const password = await hash('password123', 12)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@eventiqo.com',
      password,
      name: 'Admin Eventiqo',
      role: 'ADMIN',
      isFirstLogin: false,
    },
  })

  // Create Vendors
  const vendor1 = await prisma.vendor.create({
    data: {
      name: 'Hotel Mulia',
      category: 'Venue',
      contactInfo: 'booking@hotelmulia.com',
      averageCost: 50000000,
    }
  })

  const vendor2 = await prisma.vendor.create({
    data: {
      name: 'ABC Catering',
      category: 'Catering',
      contactInfo: 'info@abccatering.com',
      averageCost: 45000000,
    }
  })

  // Create Event
  const event1 = await prisma.event.create({
    data: {
      name: 'Wedding Alice & Bob',
      clientName: 'Alice Wonderland',
      location: 'Hotel Mulia, Jakarta',
      date: new Date('2024-12-12'),
      status: 'ACTIVE',
      totalBudget: 150000000,
      vendors: {
        create: [
          {
            vendorId: vendor1.id,
            role: 'Main Venue',
            agreedCost: 50000000,
            status: 'PAID'
          }
        ]
      },
      expenses: {
        create: [
          {
            description: 'Ballroom Rental',
            estimatedAmount: 50000000,
            actualAmount: 50000000,
            category: 'Venue',
            date: new Date(),
            status: 'PAID',
            vendorId: vendor1.id
          }
        ]
      },
      tasks: {
        create: [
          {
            title: 'Finalize Guest List',
            status: 'PENDING',
            priority: 'HIGH',
            assigneeId: admin.id
          },
          {
            title: 'Confirm Catering Menu',
            status: 'IN_PROGRESS',
            priority: 'MEDIUM',
            assigneeId: admin.id
          }
        ]
      }
    }
  })

  console.log({ admin, vendor1, vendor2, event1 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
