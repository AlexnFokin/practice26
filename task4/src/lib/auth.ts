import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: { strategy: 'jwt' },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { type: 'email' },
                password: { type: 'password' },
            },
            async authorize(creds) {
                if (!creds?.email || !creds?.password) return null;
                const user = await prisma.user.findUnique({
                    where: { email: creds.email as string },
                });
                if (!user) return null;
                const ok = await bcrypt.compare(creds.password as string, user.passwordHash);
                if (!ok) return null;
                return { id: user.id, email: user.email, name: user.name, role: user.role } as any;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = (user as any).role;
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.sub;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
    pages: { signIn: '/login' },
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
    trustHost: true,
});