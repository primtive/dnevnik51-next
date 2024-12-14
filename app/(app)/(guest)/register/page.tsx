import * as React from 'react';
import RegisterForm from './register-form';
import { getGradeNames } from '@/data/db';
import { logRequest } from '@/data/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"

export const metadata = {
  title: 'Регистрация',
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions)
  logRequest(session?.user.sid, 'register')
  const gradeNames = await getGradeNames()
  return (
    <div className='flex h-fit w-full items-center justify-center px-4'>
      <RegisterForm gradeNames={JSON.stringify(gradeNames)} />
    </div>
  );
}