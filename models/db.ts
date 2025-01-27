import { Pool } from "pg";

let globalPool: Pool;

export function getDb() {
  if (!globalPool) {
    const connectionString = process.env.POSTGRES_URL;
    console.log("Connecting to database with URL:", connectionString);

    globalPool = new Pool({
      connectionString,
      // 添加默认数据库名称，防止连接到错误的数据库
      database: 'mochi'
    });

    // 添加错误处理
    globalPool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return globalPool;
}
