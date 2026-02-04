import NextAuth, { AuthOptions } from "next-auth"
import Discord from "next-auth/providers/discord"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./db"
import bcrypt from "bcrypt"

export const authOptions : AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;
        if (!user.emailVerified) {
          throw new Error("Email not verified");
        }

        const valid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!valid) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = account?.access_token
        token.userId = user.id
        // @ts-ignore 
        token.username = user.username // TODO: fix ts-ignore
      }
      return token
    },

    async session({ session, token }) {
      // @ts-ignore 
      session.user.id = token.userId // TODO: fix ts-ignore
      // @ts-ignore
      session.user.username = token.username // TODO: fix ts-ignore
      return session
    },
  },

  pages: {
    signIn: "/login",
  },
}
