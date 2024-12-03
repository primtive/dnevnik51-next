import Link from 'next/link';
import * as React from 'react';
import localFont from "next/font/local";

const logoFont = localFont({
  src: "../app/fonts/Nunito-Black.ttf",
  //src: "../app/fonts/Ubuntu-Bold.ttf",
  variable: "--font-logo",
});

export const Logo = () => {
  return (
    <div id="logo" className={`w-min mr-5 `+logoFont.className}>
      <Link href="/">
        <h1 className='text-3xl'>dnevnik51.ru</h1>
      </Link>
    </div>
  )
}
