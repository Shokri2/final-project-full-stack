const seedCategories = async (pool) => {
  try {
    await pool.query(`
      INSERT INTO categories
      (name, description, created_by)
      VALUES
      ('Books', 'Every book you want', 1),
      ('Electronics', 'Latest electronic gadgets and devices', 1),
      ('Food', 'Fresh food and groceries', 1),
      ('Clothes', 'Fashion and stylish clothing', 1),
      ('Home', 'Home decor and appliances', 1),
      ('Pets', 'Pet food and accessories', 1),
      ('Kids', 'Toys and kids fashion', 1),
      ('Women', 'Women apparel and fashion', 1),
      ('Men', 'Men apparel and fashion', 1),
      ('Makeup', 'Beauty and makeup products', 1),
      ('Cars', 'Car accessories and parts', 1)
      ON CONFLICT (name) DO NOTHING;
    `);

    console.log("Categories seeded successfully");
  } catch (error) {
    console.error("Seeding failed:", error);
    
  }
};

export default seedCategories;
