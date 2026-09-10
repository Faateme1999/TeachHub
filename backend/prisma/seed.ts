// Prisma seed script — fills the database with a few demo users, courses, and
// lessons so the app isn't empty the first time you open it.
//
// Run it with:   npm run db:seed   (see backend/package.json)
// Prisma also runs it automatically at the end of `prisma migrate reset`.
//
// It is written to be safe to run more than once: it "upserts" users (create if
// missing, otherwise leave them), and only adds demo courses if there are none.

import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// The demo STUDENT accounts. Every one uses the password: password123
// (No `role` set here → Prisma applies the schema default, STUDENT.)
const SEED_USERS = [
  { name: 'Ada Lovelace', email: 'ada@teachhub.dev' },
  { name: 'Alan Turing', email: 'alan@teachhub.dev' },
  { name: 'Grace Hopper', email: 'grace@teachhub.dev' },
];

// The pre-defined ADMIN account. This is the ONLY admin the app ships with; she
// can create more admins from the /admin section once that flow is implemented.
const SEED_ADMIN = { name: 'Admin', email: 'admin@teachhub.dev' };

const SEED_PASSWORD = 'password123';

async function seedAssessments() {
  console.log('📝 Seeding assessments...');

  // We intentionally use the existing Outcome.
  // This Outcome already exists in the database.
  const outcome = await prisma.outcome.findFirst({
    where: {
      text: 'Present Perfect',
      lesson: {
        course: {
          title: 'General English B2',
        },
      },
    },
  });

  if (!outcome) {
    throw new Error(
      'Outcome "Present Perfect" in course "General English B2" was not found.',
    );
  }

  const missions = [
    {
      title: 'Mission 1 - Present Perfect',
      order: 1,
      passingScore: 70,
      maxAttempts: 2,
    },
    {
      title: 'Mission 2 - Present Perfect',
      order: 2,
      passingScore: 70,
      maxAttempts: 2,
    },
  ];

  const questions = [
    // -------------------------
    // Mission 1
    // -------------------------
    [
      {
        text: 'Which sentence is correct?',
        type: 'SINGLE_CHOICE' as const,
        options: [
          { text: 'I have finished my homework.', isCorrect: true },
          { text: 'I has finished my homework.', isCorrect: false },
          { text: 'I have finish my homework.', isCorrect: false },
          { text: 'I finished have my homework.', isCorrect: false },
        ],
      },
      {
        text: 'Which sentences use the Present Perfect correctly?',
        type: 'MULTIPLE_CHOICE' as const,
        options: [
          { text: 'She has visited London.', isCorrect: true },
          { text: 'They have seen this movie.', isCorrect: true },
          { text: 'He have finished his work.', isCorrect: false },
          { text: 'I has eaten breakfast.', isCorrect: false },
        ],
      },
      {
        text: 'Choose the correct form: "We ___ here for two hours."',
        type: 'SINGLE_CHOICE' as const,
        options: [
          { text: 'have been', isCorrect: true },
          { text: 'has been', isCorrect: false },
          { text: 'have be', isCorrect: false },
          { text: 'are been', isCorrect: false },
        ],
      },
      {
        text: 'Which words can commonly be used with the Present Perfect?',
        type: 'MULTIPLE_CHOICE' as const,
        options: [
          { text: 'already', isCorrect: true },
          { text: 'yet', isCorrect: true },
          { text: 'last year', isCorrect: false },
          { text: 'yesterday', isCorrect: false },
        ],
      },
      {
        text: 'Choose the correct sentence.',
        type: 'SINGLE_CHOICE' as const,
        options: [
          { text: 'Have you ever been to Paris?', isCorrect: true },
          { text: 'Did you ever been to Paris?', isCorrect: false },
          { text: 'Have you ever went to Paris?', isCorrect: false },
          { text: 'Has you ever been to Paris?', isCorrect: false },
        ],
      },
      {
        text: 'Which sentences are grammatically correct?',
        type: 'MULTIPLE_CHOICE' as const,
        options: [
          { text: 'I have never tried sushi.', isCorrect: true },
          { text: 'She has already left.', isCorrect: true },
          { text: 'They has never seen it.', isCorrect: false },
          { text: 'He have already gone.', isCorrect: false },
        ],
      },
      {
        text: 'Choose the correct sentence.',
        type: 'SINGLE_CHOICE' as const,
        options: [
          { text: 'Tom has lived here since 2020.', isCorrect: true },
          { text: 'Tom have lived here since 2020.', isCorrect: false },
          { text: 'Tom has live here since 2020.', isCorrect: false },
          { text: 'Tom living here since 2020.', isCorrect: false },
        ],
      },
      {
        text: 'Which sentences correctly use "for" with Present Perfect?',
        type: 'MULTIPLE_CHOICE' as const,
        options: [
          { text: 'I have worked here for five years.', isCorrect: true },
          { text: 'She has known him for a long time.', isCorrect: true },
          { text: 'They have lived here for 2020.', isCorrect: false },
          { text: 'He has been here for Monday.', isCorrect: false },
        ],
      },
      {
        text: 'Choose the correct question.',
        type: 'SINGLE_CHOICE' as const,
        options: [
          { text: 'Have you finished the report?', isCorrect: true },
          { text: 'Has you finished the report?', isCorrect: false },
          { text: 'Have you finish the report?', isCorrect: false },
          { text: 'Did you have finished the report?', isCorrect: false },
        ],
      },
      {
        text: 'Which sentences are correct?',
        type: 'MULTIPLE_CHOICE' as const,
        options: [
          { text: 'We have just arrived.', isCorrect: true },
          { text: 'She has never traveled abroad.', isCorrect: true },
          { text: 'I has just arrived.', isCorrect: false },
          { text: 'They have just arrive.', isCorrect: false },
        ],
      },
    ],

    // -------------------------
    // Mission 2
    // -------------------------
    [
      {
        text: 'Choose the correct sentence.',
        type: 'MULTIPLE_CHOICE' as const,
        options: [
          { text: 'I have lost my keys.', isCorrect: true },
          { text: 'She has broken her phone.', isCorrect: true },
          { text: 'He have lost his wallet.', isCorrect: false },
          { text: 'They has broken the window.', isCorrect: false },
        ],
      },
      {
        text: 'Choose the correct form: "She ___ three emails today."',
        type: 'SINGLE_CHOICE' as const,
        options: [
          { text: 'has written', isCorrect: true },
          { text: 'have written', isCorrect: false },
          { text: 'has write', isCorrect: false },
          { text: 'written has', isCorrect: false },
        ],
      },
      {
        text: 'Which sentences are correct?',
        type: 'MULTIPLE_CHOICE' as const,
        options: [
          { text: 'Have they arrived yet?', isCorrect: true },
          { text: 'Has he finished his work yet?', isCorrect: true },
          { text: 'Have she arrived yet?', isCorrect: false },
          { text: 'Has they finished yet?', isCorrect: false },
        ],
      },
      {
        text: 'Choose the correct sentence.',
        type: 'SINGLE_CHOICE' as const,
        options: [
          { text: 'I have known Sarah since 2019.', isCorrect: true },
          { text: 'I have knew Sarah since 2019.', isCorrect: false },
          { text: 'I has known Sarah since 2019.', isCorrect: false },
          { text: 'I know Sarah since 2019.', isCorrect: false },
        ],
      },
      {
        text: 'Which expressions can be used with Present Perfect?',
        type: 'MULTIPLE_CHOICE' as const,
        options: [
          { text: 'so far', isCorrect: true },
          { text: 'recently', isCorrect: true },
          { text: 'two days ago', isCorrect: false },
          { text: 'in 2018', isCorrect: false },
        ],
      },
      {
        text: 'Choose the correct sentence.',
        type: 'SINGLE_CHOICE' as const,
        options: [
          { text: 'They have lived here for ten years.', isCorrect: true },
          { text: 'They has lived here for ten years.', isCorrect: false },
          { text: 'They have live here for ten years.', isCorrect: false },
          { text: 'They living here for ten years.', isCorrect: false },
        ],
      },
      {
        text: 'Which sentences correctly use "since"?',
        type: 'MULTIPLE_CHOICE' as const,
        options: [
          { text: 'I have worked here since January.', isCorrect: true },
          { text: 'She has lived there since 2022.', isCorrect: true },
          { text: 'We have waited since three hours.', isCorrect: false },
          { text: 'He has studied since five years.', isCorrect: false },
        ],
      },
      {
        text: 'Choose the correct sentence.',
        type: 'SINGLE_CHOICE' as const,
        options: [
          { text: 'Have you ever eaten sushi?', isCorrect: true },
          { text: 'Did you ever eaten sushi?', isCorrect: false },
          { text: 'Have you ever eat sushi?', isCorrect: false },
          { text: 'Has you ever eaten sushi?', isCorrect: false },
        ],
      },
      {
        text: 'Which sentences are correct?',
        type: 'MULTIPLE_CHOICE' as const,
        options: [
          { text: 'He has just called me.', isCorrect: true },
          { text: 'We have already seen this film.', isCorrect: true },
          { text: 'She has already see this film.', isCorrect: false },
          { text: 'I have just call him.', isCorrect: false },
        ],
      },
      {
        text: 'Choose the correct sentence.',
        type: 'SINGLE_CHOICE' as const,
        options: [
          { text: 'I have never been to Japan.', isCorrect: true },
          { text: 'I has never been to Japan.', isCorrect: false },
          { text: 'I have never went to Japan.', isCorrect: false },
          { text: 'I never have been to Japan yesterday.', isCorrect: false },
        ],
      },
    ],
  ];

  for (let missionIndex = 0; missionIndex < missions.length; missionIndex++) {
    const missionData = missions[missionIndex];
    const missionQuestions = questions[missionIndex];

    // Don't create duplicates if the seed is run again.
    let mission = await prisma.mission.findFirst({
      where: {
        outcomeId: outcome.id,
        order: missionData.order,
      },
    });

    if (!mission) {
      mission = await prisma.mission.create({
        data: {
          title: missionData.title,
          order: missionData.order,
          passingScore: missionData.passingScore,
          maxAttempts: missionData.maxAttempts,
          outcomeId: outcome.id,
        },
      });

      console.log(`  • created mission: ${mission.title}`);
    } else {
      mission = await prisma.mission.update({
        where: {
          id: mission.id,
        },
        data: {
          title: missionData.title,
          passingScore: missionData.passingScore,
          maxAttempts: missionData.maxAttempts,
        },
      });

      console.log(`  • updated mission: ${mission.title}`);
    }

    const existingQuestions = await prisma.question.count({
      where: { missionId: mission.id },
    });

    if (existingQuestions === 0) {
      for (let i = 0; i < missionQuestions.length; i++) {
        const questionData = missionQuestions[i];

        await prisma.question.create({
          data: {
            text: questionData.text,
            type: questionData.type,
            order: i + 1,
            missionId: mission.id,
            options: {
              create: questionData.options.map((option, optionIndex) => ({
                text: option.text,
                isCorrect: option.isCorrect,
                order: optionIndex + 1,
              })),
            },
          },
        });
      }

      console.log(`    ✓ created ${missionQuestions.length} questions`);
    } else {
      console.log(
        `    • questions already exist (${existingQuestions}) — skipping`,
      );
    }
  }

  console.log('✅ Assessment seeding complete.');
}

async function main() {
  console.log('🌱 Seeding database…');

  // Hash the shared demo password once (bcrypt is the same lib the app uses).
  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);

  // Create each student user if they don't already exist.
  const users: User[] = [];
  for (const user of SEED_USERS) {
    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: {}, // if they exist already, change nothing
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: 'STUDENT',
      },
    });
    users.push(record);
    console.log(`  • student: ${record.email}`);
  }

  // Create (or promote) the seed admin. NOTE: we set role: 'ADMIN' in BOTH the
  // create AND update blocks so that re-running the seed on an existing user
  // guarantees they end up an admin (a plain `update: {}` would leave a
  // previously-created student unchanged).
  const admin = await prisma.user.upsert({
    where: { email: SEED_ADMIN.email },
    update: { role: 'ADMIN' },
    create: {
      name: SEED_ADMIN.name,
      email: SEED_ADMIN.email,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`  • admin: ${admin.email}`);

  // Only add demo courses if the table is empty, so re-running doesn't pile up
  // duplicate courses.
  const existingCourses = await prisma.course.count();
  if (existingCourses === 0) {
    const ada = users[0];

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
              content:
                'Create a controller and return your first route response.',
            },
          ],
        },
      },
    });

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
    });

    // Enroll Ada in the NestJS course so "My Learning" isn't empty for her.
    await prisma.enrollment.create({
      data: { userId: ada.id, courseId: nest.id },
    });

    console.log(
      `  • courses: "${nest.title}", "${react.title}" (with lessons)`,
    );
    console.log(`  • enrolled ${ada.email} in "${nest.title}"`);
  } else {
    console.log(
      `  • courses already exist (${existingCourses}) — skipping demo courses`,
    );
  }

  await seedAssessments();

  console.log(
    '✅ Seeding complete. Login → any seed email + password: ' +
      SEED_PASSWORD +
      ` (admin: ${SEED_ADMIN.email})`,
  );
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// npm run db:seed
