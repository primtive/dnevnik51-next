import { getUser, resetPassword } from "@/data/auth";
import { getPassRecovery, updatePassRecovery } from "@/data/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const password = searchParams.get('password');
  const recovery = await getPassRecovery(id)

  await resetPassword(recovery.email, password)
  await updatePassRecovery(id, {active: false})

  return NextResponse.json({ ok: true })
}