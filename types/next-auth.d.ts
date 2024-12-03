import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      sid: string,
      gid: string,
      grade_name: string,
      email: string,
      name: string,
      inits: string,
      student: boolean
    }
  }
  interface User {
    token: string;
  }
}


declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
  }
}