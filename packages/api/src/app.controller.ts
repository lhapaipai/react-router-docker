import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User as UserModel } from 'database';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  async getAllUsers(): Promise<UserModel[]> {
    return await this.prismaService.user.findMany();
  }
}
