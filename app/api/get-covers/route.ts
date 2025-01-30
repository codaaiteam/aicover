import { respData, respErr } from "@/lib/resp";
import { Cover, GetCoversRequest } from "@/types/cover";
import { getCovers } from "@/models/cover";

export async function POST(req: Request) {
  try {
    const { page = 1, limit = 30 } = await req.json() as GetCoversRequest;

    const covers: Cover[] = await getCovers(page, limit);

    return respData(covers);
  } catch (e) {
    console.log("get covers failed", e);
    return respErr("get covers failed");
  }
}
