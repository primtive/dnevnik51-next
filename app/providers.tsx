"use client"

import type { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"


export default function Providers({ session, children }: { session: Session | null, children: React.ReactNode }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}