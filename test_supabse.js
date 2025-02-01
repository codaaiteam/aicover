// test-connection.js
import { config } from 'dotenv';
import pg from 'pg';

config();

const { Pool } = pg;

async function testConnection() {
  // 使用新的环境变量名
  const connectionConfig = {
    host: 'db.cwaaozrjfnktzvljkwdn.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: process.env.SUPABASE_DB_PASSWORD, // 新的环境变量名
    ssl: {
      rejectUnauthorized: false
    }
  };

  console.log('Connection details:', {
    host: connectionConfig.host,
    port: connectionConfig.port,
    database: connectionConfig.database,
    user: connectionConfig.user,
    hasPassword: !!connectionConfig.password
  });

  const pool = new Pool(connectionConfig);

  try {
    console.log('Testing connection...');
    const client = await pool.connect();
    const result = await client.query('SELECT version()');
    console.log('Connected successfully!');
    console.log('PostgreSQL version:', result.rows[0].version);
    client.release();
    return true;
  } catch (error) {
    console.error('Connection error:', {
      message: error.message,
      code: error.code
    });
    
    if (error.code === '28P01') {
      console.log('\nPlease check:');
      console.log('1. SUPABASE_DB_PASSWORD in your .env file');
      console.log('2. Copy password from: Supabase Dashboard > Project Settings > Database > Connection Info');
    }
    
    return false;
  } finally {
    await pool.end();
  }
}

testConnection()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });