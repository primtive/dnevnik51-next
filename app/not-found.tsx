import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import * as React from 'react';

export const metadata = {
  title: 'Страница не найдена',
};

export default function NotFound() {
  return (
    <>
      <h1 className='mb-5'>Страница не найдена</h1>
      <Link className={buttonVariants({ variant: 'outline' })} href='/'>На главную</Link>
    </>
  )
}