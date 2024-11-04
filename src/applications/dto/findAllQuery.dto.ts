import { Status } from '@prisma/client';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class FindAllQueryDto {
  @IsOptional()
  @IsNumberString()
  limit: string;

  @IsOptional()
  @IsNumberString()
  offset: string;

  @IsOptional()
  @IsEnum(Status)
  status: Status;

  @IsOptional()
  @IsString()
  q: string;
}
