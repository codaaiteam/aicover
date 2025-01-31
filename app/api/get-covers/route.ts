import { respData, respErr } from "@/lib/resp";

export async function POST(req: Request) {
  try {
    const covers: any[] = []; // Default to empty array
    return respData(covers);
  } catch (e) {
    console.log("get covers failed", e);
    return respErr("get covers failed");
  }
}
