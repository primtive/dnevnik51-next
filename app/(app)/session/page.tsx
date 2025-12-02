import * as React from 'react';
import { getServerSession } from "next-auth";
import { ClientSession } from './client';
import { authOptions } from "@/auth"
import { getStudentFromGrade } from '@/data/journal';

export const metadata = {
  title: 'SessionPage',
};

export default async function SessionPage() {
  const session = await getServerSession(authOptions);
  const students = await getStudentFromGrade('8BEA86D8C0DB6C5EDAE1437ED2B2D032')
  return (
    <div>
      <p>server: {JSON.stringify(session)}</p>
      <ClientSession />
      <p>{students.map((x: any) => JSON.stringify(x))}</p>
    </div>
  );
}