import * as React from 'react';
import { getPassRecovery } from '@/data/db';
import ResetForm from './reset-form';

export const metadata = {
  title: 'Сброс пароля',
};

export default async function ResetPasswordPage({ params, }: { params: Promise<{ id: string }> }) {
  const recovery_id = (await params).id
  const pass_recovery = await getPassRecovery(recovery_id)
  
  if (!pass_recovery.active) return <p>Ссылка для восстановления уже была использована. <br /><a href='/'>На главную</a></p>

  return (
    <>
      <div className='flex h-fit w-full items-center justify-center px-4'>
        <ResetForm email={pass_recovery.email} id={recovery_id} />
      </div>
    </>
  );
}