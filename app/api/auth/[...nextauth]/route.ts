import NextAuth, { AuthOptions, Session } from "next-auth";
import { Account, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authWithCredentials, createUser, getUser } from '@/data/auth'
import { getStudentByName } from "@/data/journal";

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/login',
    verifyRequest: '/auth/verify-request',
  },
  session: {
    maxAge: 365 * 24 * 60 * 60,
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      credentials: {
        email: {},
        password: {},
        grade: {},
        name: {},
        sign_up: {},
      },
      async authorize(credentials): Promise<any> {
        if (!credentials) throw new Error('no credentials');
        try {
          if (credentials.sign_up) {
            if (await getUser({ email: credentials.email })) throw new Error(JSON.stringify({ field: 'email', text: 'Пользователь с такой почтой уже зарегистрирован' }));
            const student = await getStudentByName(credentials.grade, credentials.name)
            if (await getUser({ gid: credentials.grade, name: student.text })) throw new Error(JSON.stringify({ field: 'name', text: 'Такой ученик уже зарегистрирован' }));
            if (student) {
              return await createUser(credentials, student)
            } else {
              throw new Error(JSON.stringify({ field: 'name', text: 'Ученик не найден' }))
            }
          } else {
            const req = await authWithCredentials(credentials)
            if (req.ok) {
              return req.user
            } else {
              throw new Error(req.message);
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      // пока что вместо токена используется имя; надо переделать
      if (user) {
        return { ...token, accessToken: user.token };
      }
      return token
    },
    async session({ session, token }) {
      // пока что вместо токена используется имя; надо переделать
      const user = await getUser({ name: token.name })
      session.user = {
        sid: user.sid,
        gid: user.gid,
        grade_name: user.grade_name,
        email: user.email,
        name: user.name,
        inits: user.inits,
        student: user.student
      };
      return session;
    },
    signIn({ user, account }: any) {
      return true;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };