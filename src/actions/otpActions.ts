'use server';

import { prisma } from '@/lib/db';
import { resetPasswordSchema } from '@/lib/schema';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';

export const verifyEmail = async (id: string, otp: string) => {
  try {
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { id: id } });

    if (!user) throw new Error('Usuário não existe');

    // Pegar o otp na base de dados relacionada ao usuário
    const hashedOtp = await prisma.otp.findUnique({
      where: { userId: id, AND: { for: 'Register' } },
    });

    if (!hashedOtp)
      throw new Error('Não existe nenhum otp relacionado à este usuário');

    // Verificar se o código otp já expirou
    const timestamp = Date.now(); // Hora atual em MS
    const expiringOtpDate = dayjs(hashedOtp?.expiresAt).valueOf(); // Hora que o código otp vai expirar no formato de MS

    if (timestamp > expiringOtpDate) throw new Error('Código OTP expirado');

    // Verificar se o otp está correto
    const isOtpCorret = await bcrypt.compare(otp, hashedOtp.otp);

    if (!isOtpCorret) throw new Error('Código OTP inválido');

    // Atualizar o usuário com a informação de que o email foi verificado
    await prisma.user.update({
      where: { id: id },
      data: {
        emailVerified: true,
      },
    });

    // Remover o código otp da bd
    await prisma.otp.delete({ where: { id: hashedOtp.id } });

    return 'Email verificado com sucesso';
  } catch (error) {
    throw error;
  }
};

interface FormDataProps {
  newPassword: string;
  confirmNewPassword: string;
  userId: string;
  otp: string;
}

export const resetPassword = async (formData: FormDataProps) => {
  try {
    // Verificar se os dados do formulário estão de acordo com os critérios especificados no Zod (importante verificar isso no client e server side)
    const result = resetPasswordSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        throw new Error(issue.message);
      });
    }

    if (!result.data) throw new Error('Error');

    const { userId, otp, newPassword } = formData;

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new Error('Esse id não pertence a nenhum usuário');

    // Pegar o OTP relacionado ao usuário
    const hashedOTP = await prisma.otp.findUnique({
      where: { userId: userId, AND: { for: 'Password' } },
    });

    if (!hashedOTP)
      throw new Error('Esse código OTP não pertence a nenhum usuário');

    // Verificar se o código otp expirou
    const timestamp = Date.now(); // Hora atual em MS
    const expiringOtpDate = dayjs(hashedOTP.expiresAt).valueOf(); // Hora que o código otp vai expirar no formato de MS

    if (timestamp > expiringOtpDate) throw new Error('Código OTP expirado');

    // Verificar se o otp relacionado ao usuário é o mesmo enviado
    const isOtpCorret = await bcrypt.compare(otp, hashedOTP.otp);

    if (!isOtpCorret) throw new Error('Código OTP inválido');

    // Fazer o hash da nova senha
    const hashedNewPassword = await bcrypt.hash(newPassword, 8);

    // Atualizar senha
    await prisma.user.update({
      where: { id: userId },
      data: {
        hashedPassword: hashedNewPassword,
      },
    });

    // Remover o otp da base de dados
    await prisma.otp.delete({ where: { id: hashedOTP.id } });

    return 'Senha atualizada com sucesso';
  } catch (error) {
    throw error;
  }
};
