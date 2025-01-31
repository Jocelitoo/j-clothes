import { z } from 'zod';

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Nome precisa ter no MÍNIMO 2 digitos' })
      .max(20, { message: 'Nome só pode ter no MÁXIMO 20 digitos' }),
    email: z.string().email({ message: 'Digite um email válido' }),
    password: z
      .string()
      .min(6, { message: 'Senha precisa ter no MÍNIMO 6 digitos' })
      .max(20, { message: 'Senha só pode ter no MÁXIMO 20 digitos' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Confirmar senha precisa ter no MÍNIMO 6 digitos' })
      .max(20, { message: 'Confirmar senha só pode ter no MÁXIMO 20 digitos' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'], // Indica onde o erro será mostrado
  });

export const loginFormSchema = z.object({
  email: z.string().email({ message: 'Digite um email válido' }),
  password: z
    .string()
    .min(6, { message: 'Senha precisa ter no MÍNIMO 6 digitos' })
    .max(20, { message: 'Senha só pode ter no MÁXIMO 20 digitos' }),
});

export const addProductFormSchema = z.object({
  name: z
    .string({ message: 'Preço precisa ser uma string' })
    .min(1, 'Nome precisa ter no mínimo 1 letra'),
  price: z.coerce
    .number({ message: 'Preço precisa ser um número' })
    .min(1, 'Preço deve ser no mínimo 1'),
  description: z
    .string({ message: 'Descrição precisa ser uma string' })
    .min(5, 'Descrição precisa ter no mínimo 5 letras'),
  category: z
    .string({ message: 'Categória precisa ser uma string' })
    .min(1, 'Escolha uma categória'),
  variations: z.array(
    z.object({
      size: z
        .string({ message: 'Tamanho precisa ser uma string' })
        .min(1, 'É preciso escolher no mínimo 1 tamanho'),
      inStock: z.coerce
        .number({ message: 'Estoque precisa ser um número' })
        .min(1, 'Estoque precisa ser no mínimo 1'),
    }),
  ),
  images: z.array(
    z.object({
      url: z.string().min(1, 'É preciso escolher no mínimo 1 imagem'),
      id: z.string().min(1, 'É preciso escolher no mínimo 1 imagem'),
    }),
  ),
});

export const reviewFormSchema = z.object({
  text: z
    .string({ message: 'Texto precisa ser uma string' })
    .min(10, 'O texto precisa ter no mínimo 10 letras'),
  rating: z.coerce
    .number({ message: 'Avaliação precisa ser um número' })
    .min(1, 'Avaliação deve ser no mínimo 1')
    .max(5, 'Avaliação deve ser no máximo 5'),
});

export const newNameFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Novo nome precisa ter no MÍNIMO 2 digitos' })
    .max(20, { message: 'Novo nome só pode ter no MÁXIMO 20 digitos' }),
  newName: z
    .string()
    .min(2, { message: 'Novo nome precisa ter no MÍNIMO 2 digitos' })
    .max(20, { message: 'Novo nome só pode ter no MÁXIMO 20 digitos' }),
  password: z
    .string()
    .min(6, { message: 'Senha precisa ter no MÍNIMO 6 digitos' })
    .max(20, { message: 'Senha só pode ter no MÁXIMO 20 digitos' }),
});

export const newPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Precisa ter no MÍNIMO 6 digitos' })
      .max(20, { message: 'Só pode ter no MÁXIMO 20 digitos' }),
    newPassword: z
      .string()
      .min(6, { message: 'Precisa ter no MÍNIMO 6 digitos' })
      .max(20, { message: 'Só pode ter no MÁXIMO 20 digitos' }),
    confirmNewPassword: z
      .string()
      .min(6, {
        message: 'Precisa ter no MÍNIMO 6 digitos',
      })
      .max(20, {
        message: 'Só pode ter no MÁXIMO 20 digitos',
      }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmNewPassword'], // Indica onde o erro será mostrado
  });

export const emailResetPasswordSchema = z.object({
  email: z.string().email({ message: 'Digite um email válido' }),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: 'Precisa ter no MÍNIMO 6 digitos' })
      .max(20, { message: 'Só pode ter no MÁXIMO 20 digitos' }),
    confirmNewPassword: z
      .string()
      .min(6, {
        message: 'Precisa ter no MÍNIMO 6 digitos',
      })
      .max(20, {
        message: 'Só pode ter no MÁXIMO 20 digitos',
      }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmNewPassword'], // Indica onde o erro será mostrado
  });
