import LoginForm from './login-form';
import * as React from 'react';
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: 'Вход',
};

export default function Login() {
  return (
    <>
      <div className='flex h-fit w-full items-center justify-center px-4'>
        <LoginForm />
      </div>
      <Toaster />
    </>
  );
}