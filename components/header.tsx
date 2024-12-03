import * as React from 'react';
import { Logo } from './logo';
import { Navbar } from './navbar';
import { ThemeToggle } from './theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Signout } from './signout';
import { User } from 'lucide-react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"


export async function Header() {
  const session = await getServerSession(authOptions)
  return (
    <header className='sticky flex justify-center border-b'>
      <div className='mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6'>
        <Logo />
        <Navbar />
        <div className='flex items-center space-x-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="">
                  <AvatarFallback>{session ? session.user?.inits : <User />}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                {session ?
                  <div className='flex'>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.name?.split(' ').slice(0, 2).join(' ')}</p>
                      <p className="text-xs leading-none text-muted-foreground overflow-hidden max-w-[170px] text-ellipsis">
                        {session.user?.email}
                      </p>
                    </div>
                    <p className='text-right ml-auto'>{session.user?.grade_name}</p>
                  </div>
                  :
                  <div className='flex'>
                    <Link href="/login" className={buttonVariants({ variant: 'ghost' })}>Войти</Link>
                    <Link href="/register" className={buttonVariants({ variant: 'ghost' })}>Регистрация</Link>
                  </div>
                }
              </DropdownMenuLabel>
              {session && <>
                {/*
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Профиль
                  </DropdownMenuItem>
                  <DropdownMenuItem>Настройки</DropdownMenuItem>
                </DropdownMenuGroup>
                */}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Signout />
                </DropdownMenuItem>
              </>}
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
