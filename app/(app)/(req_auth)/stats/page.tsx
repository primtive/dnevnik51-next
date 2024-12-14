import * as React from 'react';
import { StatsComponent } from './stats';
import { Skeleton } from '@/components/ui/skeleton';
import { logRequest } from '@/data/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"

export const metadata = {
  title: 'Статистика',
};

export default async function Stats() {
  const session = await getServerSession(authOptions)
  logRequest(session?.user.sid, 'stats')
  return (
    <React.Suspense fallback={<Skeleton className='h-10 w-10' />}>
      <StatsComponent />
    </React.Suspense>
  );
}