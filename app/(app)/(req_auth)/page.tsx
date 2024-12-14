import * as React from 'react';
import { DiaryComponent } from "./diary";
import { logRequest } from '@/data/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"

export const metadata = {
  title: 'Дневник',
};

export default async function Home() {
  const session = await getServerSession(authOptions)
  logRequest(session?.user.sid, 'diary')
  return (
    <DiaryComponent />
  );
}