import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      id: "phone-otp",
      name: "WhatsApp OTP",
      credentials: { phone: { type: "text" }, code: { type: "text" } },
      async authorize(c) {
        if (!c?.phone || !c?.code) return null;
        const rec = await prisma.otpCode.findFirst({
          where: { phone: c.phone, code: c.code, used: false, expiresAt: { gt: new Date() } },
        });
        if (!rec) return null;
        await prisma.otpCode.update({ where: { id: rec.id }, data: { used: true } });
        const user = await prisma.user.upsert({
          where: { phone: c.phone },
          update: { verified: true },
          create: { phone: c.phone, verified: true, name: "User" },
        });
        return { id: user.id, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (typeof token.id === "string") session.user.id = token.id;
      if (typeof token.role === "string") session.user.role = token.role;
      return session;
    },
  },
};
