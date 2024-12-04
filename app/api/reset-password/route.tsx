import { getUser } from "@/data/auth";
import { NextRequest, NextResponse } from "next/server";
import { SMTPClient } from 'smtp-client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!getUser({ email })) return NextResponse.json({ ok: false, message: 'Пользователь с такой почтой не найден' })

  let s = new SMTPClient({
    host: 'smtp.mail.ru',
    port: 465,
  });
  await s.connect();
  await s.authLogin({
    username: 'no-reply@dnevnik51.ru',
    password: 'W542bX2WwZFqeN8s7vhD'
  })
  const recovery_link = 'sadrsadrsdr'
  const message = {
    from: 'no-reply@dnevnik51.ru',
    to: email,
    subject: 'Восстановление пароля dnevnik51.ru',
    text: `Привет!
           Кто-то активировал процедуру сброса пароля для твоего аккаунта на dnevnik51.ru
           Изменить пароль можно, перейдя по ссылке: ${recovery_link}

           Если ты не запрашивал(а) сброс пароля, то просто проигнорируй это письмо.
           Твой пароль не будет изменён до тех пор, пока ты не перейдёшь по указанной выше ссылке.
    `
  }

  await s.mail({ from: 'no-reply@dnevnik51.ru' });
  await s.rcpt({ to: email! });
  await s.data(`Subject: title\r\nbody`);
  await s.quit();

  return NextResponse.json({ ok: true })
}