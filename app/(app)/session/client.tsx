"use client"
import * as React from 'react';
import { useSession } from "next-auth/react"

export const ClientSession = () => {
  const { data: session, status } = useSession()
  return (
    <p>client: {JSON.stringify({ session, status })}</p>
  )
}
