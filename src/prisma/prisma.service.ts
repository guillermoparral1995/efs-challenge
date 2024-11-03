import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    await this.resetApplicationIdSequence();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // necessary to adjust the id after seeding so that autoincrement works correctly
  async resetApplicationIdSequence() {
    await this
      .$executeRaw`SELECT setval(pg_get_serial_sequence('"Application"', 'id'), COALESCE((SELECT MAX(id) + 1 FROM "Application"), 1), false);`;
  }
}
