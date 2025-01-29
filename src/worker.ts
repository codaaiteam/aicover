/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
  CLERK_SECRET_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // CORS 处理
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // API 路由处理
    try {
      if (url.pathname === "/api/user/credits") {
        return await handleUserCredits(request, env);
      }
      
      // 添加其他 API 路由处理...

      return new Response("Not found", { status: 404 });
    } catch (error) {
      console.error("Worker error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};

async function handleUserCredits(request: Request, env: Env) {
  // 验证 Clerk token
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const token = authHeader.split(" ")[1];
    // 这里需要添加 Clerk 验证逻辑
    
    // 获取用户邮箱
    // const userEmail = ... // 从 Clerk token 中获取

    // 查询用户积分
    const result = await env.DB.prepare(`
      SELECT COALESCE(SUM(credits), 0) as total_credits 
      FROM orders 
      WHERE user_email = ?
      AND order_status = 2 
      AND expired_at > datetime('now')
    `).bind(userEmail).all();

    const totalCredits = result.total_credits || 0;
    const usedCredits = 0; // 暂时hardcode

    return new Response(JSON.stringify({
      credits: {
        total: totalCredits,
        used: usedCredits,
        available: totalCredits - usedCredits
      }
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error handling user credits:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
