import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/db';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'text',
        },
        password: {
          label: 'password',
          type: 'password',
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Email ou senha inválido');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error('Email ou senha inválido');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword,
        );

        if (!isCorrectPassword) {
          throw new Error('Email ou senha inválido');
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      // Token carrega consigo o name e email do usuário que logou
      const user = await prisma.user.findUnique({
        where: {
          email: token.email as string,
        },
      });

      // Adicionar outros dados do usuário logado ao token
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      // Session por padrão retorna name e email, então não precisa ser especificado embaixo
      session.user.id = token.id as string;
      session.user.emailVerified = token.emailVerified as boolean;
      session.user.createdAt = token.createdAt as string;
      session.user.updatedAt = token.updatedAt as string;
      session.user.role = token.role as string;

      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
