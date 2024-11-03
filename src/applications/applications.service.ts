import { Injectable } from '@nestjs/common';
import { ApplicationDto } from './dto/application.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  create(dto: ApplicationDto) {
    console.log('dto', dto);
    return this.prisma.application.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.application.findMany();
  }

  findOne(id: number) {
    return this.prisma.application.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, dto: ApplicationDto) {
    return this.prisma.application.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.application.delete({
      where: {
        id,
      },
    });
  }
}
