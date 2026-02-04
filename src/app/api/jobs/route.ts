import { NextResponse } from "next/server";

import { getJobs } from "@/lib/jobs-service";

export const revalidate = 86400;

export async function GET() {
  const jobs = await getJobs();

  return NextResponse.json(jobs, {
    headers: {
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
