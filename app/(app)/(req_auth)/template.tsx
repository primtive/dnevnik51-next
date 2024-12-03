import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const paragraphs = [
  {
    title: 'Сайт был обновлен!',
    text: 'Если вы пользовались сайтом до этого, войдите заново. Если найдете проблемы, пожалуйста, напишите на tg: @pr1mitive'
  },
  {
    title: 'Что это за сайт?',
    text: 'Это быстрый и удобный дневник, созданный как аналог de.edu.orb.ru. Пользоваться им может любой ученик школы №51!'
  },
  {
    title: 'Зачем это нужно?',
    text: 'Сайт расширяет функции электронного дневника, позволяет смотреть выписку всех оценок, а также статистику по классу. Главная особенность: для регистрации не нужны данные от Госуслуг.'
  }
]

export default async function Template({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) return <div className="flex h-fit w-full items-center justify-center px-4">
    <Card className="w-fit max-w-[600px]">
      <CardHeader>
        <CardTitle><p className="text-2xl font-semibold">Добро пожаловать на dnevnik51.ru!</p></CardTitle>
      </CardHeader>
      <CardContent>
        {paragraphs.map(p => <>
          <h1 className="text-xl">{p.title}</h1>
          <p className="mb-3">{p.text}</p>
        </>)}
        <p>Войдите, перед тем как пользоваться сайтом</p>
        <p>Если вы у нас впервые, то <a href="/register">зарегистрируйтесь</a></p>
      </CardContent>
      <CardFooter>
        <div className="space-x-5 mx-auto">
          <Link className={buttonVariants({ variant: "outline" })} href='/login'>Войти</Link>
          <Link className={buttonVariants({ variant: "outline" })} href='/register'>Регистрация</Link>
        </div>
      </CardFooter>
    </Card>
  </div>
  return <>{children}</>
}