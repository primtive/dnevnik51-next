import { NextRequest, NextResponse } from "next/server";
import { getDiary } from "@/data/journal"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  const { searchParams } = new URL(req.url);

  if (!session) return NextResponse.json({ ok: false, error: 'not authorized' }, { status: 401 });
  if (!searchParams.get("date")) return NextResponse.json({ ok: false, error: 'missing date' }, { status: 400 });

  const diary = await getDiary(session!.user!.sid, searchParams.get("date"))
  return NextResponse.json({ ok: true, data: diary })
  // reactStringReplace(lesson.homework, /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g, (match, i) => <a className='text-red' href='withProtocol' key={i}> {console.log(match)}{ (new URL(match)).hostname} </a>)}
}