// Clear and repopulate the database.
const { PrismaClient } = require("../../generated/prisma/client");
const prisma = new PrismaClient();
const { faker } = require("@faker-js/faker");
const db = require("../db");

async function seed() {
  console.log("Seeding the database.");
  try {
    // Clear the database.
    // await db.query("DROP TABLE IF EXISTS student, instructor;");

    // Recreate the tables

    // await db.query(`
    //   CREATE TABLE instructor (
    //     id SERIAL PRIMARY KEY,
    //     username TEXT UNIQUE NOT NULL,
    //     password TEXT NOT NULL
    //   );
    //   CREATE TABLE student (
    //     id SERIAL PRIMARY KEY,
    //     name TEXT NOT NULL,
    //     cohort TEXT NOT NULL,
    //     instructorId INTEGER NOT NULL REFERENCES instructor(id) ON DELETE CASCADE
    //   );
    // `);

    // // Add 5 instructors. After deleting current table.
    // await prisma.instructor.deleteMany();
    await prisma.student.deleteMany();
    await prisma.instructor.deleteMany();

    const instructors = await Promise.all(
      [...Array(5)].map(() =>
        prisma.instructor.create({
          data: {
            username: faker.internet.userName(),
            password: faker.internet.password(),
          },
        })
      )
    );
    // await prisma.instructor.deleteMany({
    //   where: { id: [1, 2, 3, 4, 5] },
    // });

    // Add 4 students for each instructor. After deleting existing table.
    // await prisma.student.deleteMany();
    await Promise.all(
      [...Array(20)].map((_, i) =>
        prisma.student.create({
          data: {
            name: faker.person.fullName(),
            cohort: faker.number.int({ min: 2000, max: 3000 }),
            instructorId: instructors[i % instructors.length].id,
          },
        })
      )
    );
    // await prisma.student.deleteMany({
    //   where: {
    //     id: [
    //       1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    //     ],
    //   },
    // });

    console.log("Database is seeded.");
  } catch (err) {
    console.error(err);
  }
}

// Seed the database if we are running this file directly.
if (require.main === module) {
  seed();
}

module.exports = seed;
