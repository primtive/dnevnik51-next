import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Providers from "./providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Дневник",
  description: "dnevnik51.ru",
  icons: {
    icon: "/favicon.ico"
  },
  // themeColor: [
  //   { media: "(prefers-color-scheme: light)", color: "white" },
  //   { media: "(prefers-color-scheme: dark)", color: "black" },
  // ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions)

  return (<html suppressHydrationWarning>
    <body className={geistMono.className + ' flex flex-col h-screen justify-between'}>
      <Providers session={session}>
        <Header />
        <div className=" mx-1 mt-5 md:mx-5 lg:mx-20 mb-auto">
          {children}
        </div>
        <Footer />
      </Providers>
    </body>
  </html>
  );
}
