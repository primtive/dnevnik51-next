import * as React from 'react';
import RegisterForm from './register-form';
import { getGradeNames } from '@/data/db';

export const metadata = {
  title: 'Регистрация',
};

export default async function RegisterPage() {
  const gradeNames = await getGradeNames()
  return (
    <div className='flex h-fit w-full items-center justify-center px-4'>
      <RegisterForm gradeNames={JSON.stringify(gradeNames)} />
    </div>
  );
}