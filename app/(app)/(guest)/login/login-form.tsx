"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button, buttonVariants } from "@/components/ui/button"
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

const formSchema = z.object({
  email: z
    .string({ message: 'Введите почту' })
    .email({ message: 'Неверная почта' }),
  password: z
    .string({ message: 'Введите пароль' })
    .min(4, {
      message: 'Введите хотя бы 4 символа'
    })
})

export default function LoginForm() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const res = await signIn("credentials", {
      callbackUrl: '/',
      redirect: false,
      email: values.email,
      password: values.password
    });
    setLoading(false);
    if (res?.error) {
      form.setError("password", {
        type: "manual",
        message: res?.error,
      })
    } else {
      // router.push(res?.url!)
      window.location.href = res?.url!
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-2xl">Вход в электронный дневник</CardTitle>
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
                    <div className="flex items-center">
                      <Label htmlFor="password">Пароль</Label>
                      <Link href="#" className="ml-auto inline-block text-sm underline">
                        Забыли пароль?
                      </Link>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">Вход</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <CardDescription>
          <p className="text-accent-foreground">Нет аккаунта? <Link href="/register" className="font-bold rounded-sm hover:bg-accent hover:text-accent-foreground">Зарегистрироваться</Link></p>
          Если у вас возникли проблемы со входом, то пишите на тг: <Link href="https://t.me/pr1mitive" className="rounded-sm hover:bg-accent hover:text-accent-foreground">@pr1mitive</Link>
        </CardDescription>
      </CardFooter>
    </Card>
  )
}
