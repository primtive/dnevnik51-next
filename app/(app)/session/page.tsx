import * as React from 'react';
import { getServerSession } from "next-auth";
import { ClientSession } from './client';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const metadata = {
  title: 'SessionPage',
};

export default async function SessionPage() {
  const session = await getServerSession(authOptions);
  
  return (
    <div>
      <p>server: {JSON.stringify(session)}</p>
      <ClientSession />
    </div>
  );
}