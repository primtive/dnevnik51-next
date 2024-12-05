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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import * as React from "react"
import { useRouter } from 'next/navigation'
import { PasswordInput } from "@/components/password-input"

const formSchema = z.object({
  password: z
    .string({ message: 'Введите пароль' })
    .min(4, {
      message: 'Введите хотя бы 4 символа'
    })
})

export default function ResetForm({ email, id }: { email: string, id: string }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    fetch(`/api/reset-password-2?password=${values.password}&id=${id}`).then(x => x.json()).then(json => {
      setLoading(false)
      if (json?.ok) {
        router.push('/login')
      } else {
        form.setError("password", {
          type: "manual",
          message: 'Ошибка',
        })
      }
    })
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-2xl">Смена пароля</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Почта: {email}</p><br />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Новый пароль
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">Сменить</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
