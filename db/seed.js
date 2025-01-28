const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/mochi',
});

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    // Insert a test order
    const result = await client.query(`
      INSERT INTO orders (order_no, user_email, credits, amount, order_status)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (order_no) DO NOTHING
      RETURNING *
    `, ['TEST123', 'codaaiteam@gmail.com', 100, 1000, 2]); // status 2 means success
    
    console.log('Inserted test order:', result.rows[0]);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run seed
seedDatabase().catch(console.error);
