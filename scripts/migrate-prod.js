const { Pool } = require('pg');
const { readFileSync } = require('fs');
const { join } = require('path');

// 确保使用生产环境数据库
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is required');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // 如果使用 Heroku 或类似平台需要这个配置
  }
});

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('Running migrations...');
    
    // 读取并执行迁移文件
    const migrationPath = join(__dirname, '..', 'db', 'migrations', '001_init.sql');
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

// 运行迁移
runMigrations().catch(console.error);
