const API_BASE = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8787';

export async function fetchUserCredits(token: string) {
  const response = await fetch(`${API_BASE}/api/user/credits`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user credits');
  }

  return response.json();
}

// 添加其他 API 调用...
