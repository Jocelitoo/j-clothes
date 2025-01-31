'use server';

import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';

interface UpdateUserNameDataProps {
  id: string;
  newName: string;
  password: string;
}

export const updateUserName = async (data: UpdateUserNameDataProps) => {
  try {
    const { id, newName, password } = data;

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { id: id } });

    if (!user) throw new Error('Usuário não existe');

    // Verificar se a senha está correta
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword,
    );

    if (!isPasswordCorrect) throw new Error('Senha incorreta');

    // Verificar se o nome está disponível
    const nameInUse = await prisma.user.findUnique({
      where: { name: newName },
    });

    if (nameInUse) throw new Error('Esse nome já esta em uso');

    // Atualizar o nome do usuário
    await prisma.user.update({ where: { id: id }, data: { name: newName } });

    return 'Nome atualizado com sucesso';
  } catch (error) {
    throw error;
  }
};

interface UpdateUserPasswordDataProps {
  id: string;
  password: string;
  newPassword: string;
}

export const updateUserPassword = async (data: UpdateUserPasswordDataProps) => {
  try {
    const { id, password, newPassword } = data;

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { id: id } });

    if (!user) throw new Error('Usuário não existe');

    // Verificar se a senha está correta
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword,
    );

    if (!isPasswordCorrect) throw new Error('Senha incorreta');

    // Criptografar a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    // Atualizar a senha do usuário
    await prisma.user.update({
      where: { id: id },
      data: { hashedPassword: hashedPassword },
    });

    return 'Senha atualizada com sucesso';
  } catch (error) {
    throw error;
  }
};
