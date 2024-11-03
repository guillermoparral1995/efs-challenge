import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ApplicationsModule } from './applications/applications.module';

@Module({
  imports: [ApplicationsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
