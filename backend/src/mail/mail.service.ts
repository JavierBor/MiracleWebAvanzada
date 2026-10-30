import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class MailService {
  private transporter;

  // Inyectamos PrismaService en el constructor
  constructor(private prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async enviarAlertaAdmin(emailDestino: string, asunto: string, mensaje: string) {
    try {
      let destinatarios: string[] = [];

      // Si recibe la palabra "todos", busca los correos en la BD
      if (emailDestino === 'todos') {
        const usuarios = await this.prisma.usuario.findMany({
          select: { correo: true }
        });
        destinatarios = usuarios.map(u => u.correo);
      } else {
        destinatarios = [emailDestino];
      }

      // Si no hay destinatarios, no hacemos nada
      if (destinatarios.length === 0) {
        throw new Error('No hay usuarios para enviar la alerta.');
      }

      const info = await this.transporter.sendMail({
        from: '"Miracle Admin System" <no-reply@miracle.com>',
        to: emailDestino === 'todos' ? process.env.SMTP_USER : emailDestino, // Si es masivo, el 'To' va a ti mismo
        bcc: emailDestino === 'todos' ? destinatarios : [], // Los usuarios van en copia oculta
        subject: `[Alerta Admin] ${asunto}`,
        text: mensaje,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;">
            <h2 style="color: #8b008b; border-bottom: 1px solid #eee; padding-bottom: 10px;">Alerta de Moderación</h2>
            <p style="font-size: 16px; color: #333;">Hola,</p>
            <p style="font-size: 16px; color: #333;">Has recibido un mensaje del panel de administración de Miracle:</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #8b008b; margin: 20px 0;">
              <p style="margin: 0; font-size: 15px; color: #555;">${mensaje}</p>
            </div>
            <p style="font-size: 12px; color: #999; margin-top: 30px;">Si crees que esto es un error, por favor contacta a soporte.</p>
          </div>
        `,
      });
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw new Error('Fallo al enviar el correo de alerta.');
    }
  }
}