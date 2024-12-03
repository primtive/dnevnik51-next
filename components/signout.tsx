"use client"

import * as React from 'react';
import { signOut } from "next-auth/react"

export const Signout = () => {
  return (
    <button onClick={() => signOut()} className='w-full'><p className='w-min'>Выйти</p></button>
  )
}
