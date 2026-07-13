// Prisma seed script — fills the database with a few demo users, courses, and
// lessons so the app isn't empty the first time you open it.
//
// Run it with:   npm run db:seed   (see backend/package.json)
// Prisma also runs it automatically at the end of `prisma migrate reset`.
//
// It is written to be safe to run more than once: it "upserts" users (create if
// missing, otherwise leave them), and only adds demo courses if there are none.

import { PrismaClient, type User } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// The demo accounts. Every one uses the password: password123
const SEED_USERS = [
  { name: 'Ada Lovelace', email: 'ada@teachhub.dev' },
  { name: 'Alan Turing', email: 'alan@teachhub.dev' },
  { name: 'Grace Hopper', email: 'grace@teachhub.dev' },
]

const SEED_PASSWORD = 'password123'

async function main() {
  console.log('🌱 Seeding database…')

  // Hash the shared demo password once (bcrypt is the same lib the app uses).
  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10)

  // Create each user if they don't already exist.
  const users: User[] = []
  for (const user of SEED_USERS) {
    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: {}, // if they exist already, change nothing
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    })
    users.push(record)
    console.log(`  • user: ${record.email}`)
  }

  // Only add demo courses if the table is empty, so re-running doesn't pile up
  // duplicate courses.
  const existingCourses = await prisma.course.count()
  if (existingCourses === 0) {
    const ada = users[0]

    const nest = await prisma.course.create({
      data: {
        title: 'Intro to NestJS',
        description:
          'Build your first REST API with NestJS: modules, controllers, services, and Prisma.',
        price: 0,
        lessons: {
          create: [
            {
              title: 'What is NestJS?',
              content: 'An overview of the NestJS framework and why it exists.',
            },
            {
              title: 'Your first controller',
              content: 'Create a controller and return your first route response.',
            },
          ],
        },
      },
    })

    const react = await prisma.course.create({
      data: {
        title: 'React for Beginners',
        description:
          'Learn components, props, state, and hooks by building a small app.',
        price: 19.99,
        lessons: {
          create: [
            {
              title: 'Components & JSX',
              content: 'How UI is built from small, reusable components.',
            },
          ],
        },
      },
    })

    // Enroll Ada in the NestJS course so "My Learning" isn't empty for her.
    await prisma.enrollment.create({
      data: { userId: ada.id, courseId: nest.id },
    })

    console.log(`  • courses: "${nest.title}", "${react.title}" (with lessons)`)
    console.log(`  • enrolled ${ada.email} in "${nest.title}"`)
  } else {
    console.log(`  • courses already exist (${existingCourses}) — skipping demo courses`)
  }

  console.log('✅ Seeding complete. Demo login → any seed email + password: ' + SEED_PASSWORD)
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
