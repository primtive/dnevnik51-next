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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { signIn } from "next-auth/react";
import * as React from "react"
import { redirect, useRouter } from 'next/navigation'
import { PasswordInput } from "@/components/password-input"
import { useSession } from "next-auth/react"

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
  const { data: session, status } = useSession()
  const router = useRouter()
  if (status == 'authenticated') router.push('/')
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false);
  const [resetLoading, setResetLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  function resetPassword() {
    setResetLoading(true)
    fetch('/api/reset-password?email=' + email).then(x => x.json()).then(json => {
      setResetLoading(false)
      if (json.ok) {
        toast({
          title: "Письмо отправлено",
          description: "Проверьте почту",
        })
      } else {
        toast({
          title: "Ошибка",
          description: json?.message,
        })
      }
    })

  }
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Link href="#" className="ml-auto inline-block text-sm underline">
                            Забыли пароль?
                          </Link>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Забыл пароль</DialogTitle>
                            <DialogDescription>
                              Вам придет письмо на эту почту:
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                              <Input
                                id="email-p"
                                value={form.getValues().email}
                                onChange={e => setEmail(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter className="sm:justify-start">
                            <Button type="button" disabled={resetLoading} onClick={x => resetPassword()}>
                              Отправить
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
