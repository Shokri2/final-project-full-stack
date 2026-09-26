import { pool } from "../src/config/db.js";
import categorySeeds from "./category.Seeds.js";
import usersSeeds from "./users.Seeds.js";

const runSeeds = async () => {
  try {
    console.log("Starting seeding process...");

    await usersSeeds(pool);
    console.log("Users seeded successfully.");

    await categorySeeds(pool);
    console.log("Categories seeded successfully.");

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error during seeding process:", error);
  } finally {
    await pool.end();
  }
};

runSeeds();
