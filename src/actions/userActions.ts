'use server';

import { prisma } from '@/lib/db';
import { registerFormSchema } from '@/lib/schema';
import bcrypt from 'bcrypt';
import { sendOTPVerificationEmail } from './emailSender';

export const createUser = async (formData: unknown) => {
  try {
    // Verificar se os dados do formulário estão de acordo com os critérios especificados no Zod (importante verificar isso no client e server side)
    const result = registerFormSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        throw new Error(issue.message);
      });
    }

    if (!result.data) throw new Error('Error');

    const { email, name, password } = result.data;

    // Verificar se já existe alguém usando o nome escolhido
    const nameInUse = await prisma.user.findUnique({
      where: { name: name },
    });

    if (nameInUse) {
      throw new Error('Esse nome já está em uso');
    }

    // Verificar se já existe alguém usando o email escolhido
    const emailInUse = await prisma.user.findUnique({
      where: { email: email },
    });

    if (emailInUse) {
      throw new Error('Esse email já está em uso');
    }

    // 'Criptografar' password
    const hashedPassword = await bcrypt.hash(password as string, 8);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        hashedPassword: hashedPassword,
        role: 'User',
      },
    });

    // Enviar o email de confirmação
    await sendOTPVerificationEmail(user.id, email);

    return 'Confirme seu email';
  } catch (error) {
    throw error;
  }
};
