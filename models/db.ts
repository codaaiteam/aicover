import { Pool, PoolConfig, DatabaseError } from "pg";

// 修改类型定义，允许 null
let globalPool: Pool | null = null;
let retryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

export function getDb(): Pool {
  if (!globalPool) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined');
    }

    const projectId = supabaseUrl.match(/https:\/\/(.*?)\.supabase\.co/)?.[1];
    if (!projectId) {
      throw new Error('Invalid Supabase URL format');
    }

    const poolConfig: PoolConfig = {
      host: `db.${projectId}.supabase.co`,
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: process.env.SUPABASE_DB_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 60000,
      max: 10,
      min: 2,
    };

    try {
      console.log("Attempting to connect to database:", {
        host: poolConfig.host,
        database: poolConfig.database,
        ssl: true,
        timeout: poolConfig.connectionTimeoutMillis
      });

      globalPool = new Pool(poolConfig);

      globalPool.on('error', (err: Error) => {
        console.error('Unexpected PostgreSQL client error:', {
          message: err.message,
          name: err.name,
          stack: err.stack
        });
      });

      globalPool.on('connect', (client) => {
        client.on('error', (err: Error) => {
          console.error('Database client error:', err);
        });
      });

      globalPool.on('acquire', () => {
        console.log('Client acquired from pool');
      });

    } catch (error) {
      const err = error as Error;
      console.error('Failed to create database pool:', {
        message: err.message,
        stack: err.stack
      });
      throw error;
    }
  }

  return globalPool;
}

export async function testDatabaseConnection(): Promise<boolean> {
  const pool = getDb();
  
  const tryConnect = async (): Promise<boolean> => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW() as current_time, version() as version');
      console.log('Database connection successful:', {
        currentTime: result.rows[0].current_time,
        version: result.rows[0].version
      });
      client.release();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        const pgError = error as DatabaseError;
        console.error('Database connection attempt failed:', {
          message: pgError.message,
          code: pgError.code,
          detail: pgError.detail,
          schema: pgError.schema,
          table: pgError.table,
          constraint: pgError.constraint
        });
      } else {
        console.error('Unknown error:', error);
      }
      
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        console.log(`Retrying connection in ${RETRY_DELAY/1000} seconds... (Attempt ${retryCount}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return tryConnect();
      }
      
      console.error('Max retry attempts reached. Connection failed.');
      return false;
    }
  };

  return tryConnect();
}

export async function quickTest() {
  console.log('Testing database connection...');
  console.log('Environment variables:', {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasDbPassword: !!process.env.SUPABASE_DB_PASSWORD
  });
  
  const isConnected = await testDatabaseConnection();
  console.log('Connection test result:', isConnected);
  return isConnected;
}

export async function closePool(): Promise<void> {
  if (globalPool) {
    try {
      await globalPool.end();
      console.log('Database pool closed successfully');
      globalPool = null; // 现在这里不会有类型错误
      retryCount = 0;
    } catch (error) {
      const err = error as Error;
      console.error('Error closing database pool:', {
        message: err.message,
        stack: err.stack
      });
      throw error;
    }
  }
}