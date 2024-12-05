import { getUser } from "@/data/auth";
import { newPassRecovery } from "@/data/db";
import { makeid } from "@/data/utils";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!email) return NextResponse.json({ ok: false, message: 'Укажите почту' })
  if (!getUser({ email })) return NextResponse.json({ ok: false, message: 'Пользователь с такой почтой не найден' })

  const recovery_id = makeid()
  const recovery_link = 'https://dnevnik51.ru/reset-password/' + recovery_id

  await newPassRecovery({
    email,
    id: recovery_id,
    active: true
  })

  const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: process.env.MAIL_EMAIL,
    to: email,
    subject: 'Восстановление пароля dnevnik51.ru',
    text: `Привет!
  Кто-то активировал процедуру сброса пароля для твоего аккаунта на dnevnik51
  Изменить пароль можно, перейдя по ссылке: ${recovery_link}
    `
  }
  transporter.sendMail(mailOptions);

  return NextResponse.json({ ok: true })
}