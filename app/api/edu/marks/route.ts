import { NextRequest, NextResponse } from "next/server";
import { getFinalMarks, getMarks } from "@/data/journal"
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  const { searchParams } = new URL(req.url);

  if (!session) return NextResponse.json({ ok: false, error: 'not authorized' }, { status: 401 });
  if (!searchParams.get("marks_mode")) return NextResponse.json({ ok: false, error: 'missing marks_mode' }, { status: 400 });
  if (!searchParams.get("period")) return NextResponse.json({ ok: false, error: 'missing period' }, { status: 400 });
  let marks
  switch (searchParams.get("marks_mode")) {
    case 'pm':
      marks = await getMarks(session!.user!.sid, session!.user!.gid, searchParams.get("period"))
      return NextResponse.json({ ok: true, data: marks })
    case 'fm':
      marks = await getFinalMarks(session!.user!.sid, session!.user!.gid)
      return NextResponse.json({ ok: true, data: marks })
  }
}