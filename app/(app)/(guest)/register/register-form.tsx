"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { signIn } from "next-auth/react";
import * as React from "react"
import { useRouter } from 'next/navigation'
import { PasswordInput } from "@/components/password-input"
import { useSession } from "next-auth/react"

function parseError(error: string) {
  try {
    return JSON.parse(error.slice(7))
  } catch (err: any) {
    return {message: err, field: 'name'}
  }
  
}

const formSchema = z.object({
  email: z
    .string({ message: 'Введите почту' })
    .email({ message: 'Неверная почта' }),
  password: z
    .string({ message: 'Введите пароль' })
    .min(4, { message: 'Введите хотя бы 4 символа' }),
  grade: z
    .string({ message: 'Укажите класс' }),
  name: z
    .string({ message: 'Введите фамилию' })
})

export default function RegisterForm({ gradeNames }: { gradeNames: any }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  if (status == 'authenticated') router.push('/')
  const [loading, setLoading] = React.useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const res = await signIn("credentials", {
      callbackUrl: '/',
      redirect: false,
      email: values.email,
      password: values.password,
      grade: values.grade,
      name: values.name,
      sign_up: true
    });
    setLoading(false);
    if (res?.error) {
      const error = parseError(res.error);
      form.setError(error.field, {
        type: "manual",
        message: error.text,
      })
    } else {
      // router.push(res?.url!)
      window.location.href = res?.url!
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-2xl">Регистрация в дневнике</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Почта
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Пароль
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Класс
                  </FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Выберите класс" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {JSON.parse(gradeNames).map((gn: { gid: string, name: string }) => <SelectItem key={gn.gid} value={gn.gid}>{gn.name}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Фамилия
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">Зарегистрироваться</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <CardDescription>
        <p className="text-accent-foreground">Уже зарегистрированы? <Link href="/login" className="font-bold rounded-sm hover:bg-accent hover:text-accent-foreground">Войти</Link></p>
        Если у вас возникли проблемы с регистрацией, то пишите на тг: <Link href="https://t.me/pr1mitive" className="rounded-sm hover:bg-accent hover:text-accent-foreground">@pr1mitive</Link>
        </CardDescription>
      </CardFooter>
    </Card>
  )
}
