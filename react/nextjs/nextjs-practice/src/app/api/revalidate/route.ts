import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { tag, secret } = await req.json();

  // Validate secret token to prevent unauthorized purging
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret token" }, { status: 401 });
  }

  if (!tag) {
    return NextResponse.json({ error: "Tag is required" }, { status: 400 });
  }

  try {
    revalidateTag(tag);
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      message: `Tag '${tag}' has been invalidated.`
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 });
  }
}
