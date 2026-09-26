import bcrypt from "bcrypt";

const seedUsers = async (pool) => {
  try {
    const hashedPassword = await bcrypt.hash("Test123", 10);

    await pool.query(
      `
      INSERT INTO users
      (fname, lname, email, hashed_password, role, avatar)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING;
      `,
      [
        "admin",
        "system",
        "admin@admin.com",
        hashedPassword,
        "admin",
        "https://www.google.com",
       
      ],
    );

    console.log("Users seeded successfully");
  } catch (error) {
    console.error("User seeding failed:", error);
  
  }
};

export default seedUsers;
