import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service.js';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('alerta')
  async sendAlerta(
    @Body('email') email: string,
    @Body('asunto') asunto: string,
    @Body('mensaje') mensaje: string,
  ) {
    return this.mailService.enviarAlertaAdmin(email, asunto, mensaje);
  }
}