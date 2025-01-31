'use server';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/db';

dayjs.extend(utc);

const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_PASS;
const url = process.env.URL;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

export const sendOTPVerificationEmail = async (id: string, email: string) => {
  try {
    const otp = crypto.randomUUID(); // Gera uma string de 36 caracteres em formato hexadecimal

    // Organizar a data
    const timestamp = Date.now() + 3600000; // Hora atual + 1 hora
    const formatedDate = dayjs(timestamp)
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'); // Formata a data pro formato que o MongoDB aceita

    // Opções do email que será enviado
    const mailOptions = {
      from: gmailUser,
      to: email,
      subject: 'Verifique seu email',
      html: `<p>Clique no botão abaixo para verificar seu email</p><a href='${url + '/otp/confirmarEmail/' + id + '/' + otp}' style='background-color:#0af573;padding-left:1rem;padding-right:1rem;padding-top:0.5rem;padding-bottom:0.5rem;text-decoration:none;color:black;border-radius:0.375rem;margin-top:1rem;margin-bottom: 1rem;'>Confirmar email</a><p>Esse link <b>expira em 1 hora</b>.</p>`,
    };

    // Hash o otp
    const hashedOTP = await bcrypt.hash(otp, 8);

    // Criar o otp na base de dados
    await prisma.otp.create({
      data: {
        user: { connect: { id: id } },
        otp: hashedOTP,
        for: 'Register',
        expiresAt: formatedDate,
      },
    });

    // Enviar email de confirmação para o usuário
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

export const sendOTPResetPassword = async (email: string) => {
  try {
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user) throw new Error('Esse email não pertence a nenhum usuário');

    // Gerar o otp
    const otp = crypto.randomUUID(); // Gera uma string de 36 caracteres em formato hexadecimal

    // Organizar a data
    const timestamp = Date.now() + 3600000; // Hora atual + 1 hora
    const formatedDate = dayjs(timestamp)
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'); // Formata a data pro formato que o MongoDB aceita

    // Opções do email que será enviado
    const mailOptions = {
      from: gmailUser,
      to: email,
      subject: 'Alterar senha',
      html: `<p>Clique no botão abaixo para alterar sua senha</p><a href='${url + '/otp/resetarSenha/' + user.id + '/' + otp}' style='background-color:#0af573;padding-left:1rem;padding-right:1rem;padding-top:0.5rem;padding-bottom:0.5rem;text-decoration:none;color:black;border-radius:0.375rem;margin-top:1rem;margin-bottom: 1rem;'>Alterar senha</a><p>Esse link <b>expira em 1 hora</b>.</p>`,
    };

    // identificar e remover outro otp usado pra alterar senha relacionado ao usuário (só pode haver 1)
    const hasOTP = await prisma.otp.findUnique({
      where: { userId: user.id, AND: { for: 'Password' } },
    });

    if (hasOTP) {
      await prisma.otp.delete({ where: { id: hasOTP.id } });
    }

    // Hash o otp
    const hashedOTP = await bcrypt.hash(otp, 8);

    // Criar o otp na base de dados
    await prisma.otp.create({
      data: {
        user: { connect: { id: user.id } },
        otp: hashedOTP,
        for: 'Password',
        expiresAt: formatedDate,
      },
    });

    // Enviar email de confirmação para o usuário
    await transporter.sendMail(mailOptions);

    return 'Email enviado';
  } catch (error) {
    throw error;
  }
};
