import LoginForm from './login-form';
import * as React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { logRequest } from '@/data/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"

export const metadata = {
  title: 'Вход',
};

export default async function Login() {
  const session = await getServerSession(authOptions)
  logRequest(session?.user.sid, 'login')
  return (
    <>
      <div className='flex h-fit w-full items-center justify-center px-4'>
        <LoginForm />
      </div>
      <Toaster />
    </>
  );
}