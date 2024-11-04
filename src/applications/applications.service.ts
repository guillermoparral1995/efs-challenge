import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationDto } from './dto/application.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  private handlePrismaError(
    e: Prisma.PrismaClientKnownRequestError,
    id?: number,
  ) {
    if (e.code === 'P2002') {
      throw new ConflictException('Application already exists');
    }
    if (e.code === 'P2025') {
      throw new NotFoundException(
        id
          ? `Application with id ${id} does not exist`
          : 'Application not found',
      );
    }
    throw e;
  }

  async create(dto: ApplicationDto) {
    try {
      const response = await this.prisma.application.create({
        data: dto,
      });
      return response;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        this.handlePrismaError(e);
      }
      throw e;
    }
  }

  findAll({ offset, limit, status, q }) {
    const where = {
      ...(status ? { status } : {}),
      ...(q
        ? { name: { contains: q, mode: Prisma.QueryMode.insensitive } }
        : {}),
    };
    return this.prisma.application.findMany({
      skip: offset ? +offset : 0,
      take: limit ? +limit : 10,
      where,
    });
  }

  async findById(id: number) {
    const response = await this.prisma.application.findUnique({
      where: {
        id,
      },
    });
    if (!response) {
      throw new NotFoundException(`Application with id ${id} does not exist`);
    }
    return response;
  }

  async update(id: number, dto: ApplicationDto) {
    try {
      const response = await this.prisma.application.update({
        where: {
          id,
        },
        data: dto,
      });
      return response;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        this.handlePrismaError(e, id);
      }
      throw e;
    }
  }

  async remove(id: number) {
    try {
      const response = await this.prisma.application.delete({
        where: {
          id,
        },
      });
      return response;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        this.handlePrismaError(e);
      }
      throw e;
    }
  }
}
