// test-db.ts
import { quickTest } from './models/db'; // 根据你的文件路径调整

async function runTest() {
  try {
    await quickTest();
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

runTest();