const { Pool } = require('pg');
const { readFileSync } = require('fs');
const { join } = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/mochi',
});

async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log('Running migrations...');
    
    // Read and execute the migration file
    const migrationPath = join(__dirname, 'migrations', '001_init.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    await client.query(migrationSQL);
    
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migrations
runMigrations().catch(console.error);
