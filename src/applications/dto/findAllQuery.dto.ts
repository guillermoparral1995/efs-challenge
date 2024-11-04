import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class FindAllQueryDto {
  @ApiProperty({
    example: 5,
    description: 'Amount of results to return',
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsNumberString()
  limit: string;

  @ApiProperty({
    example: 10,
    description: 'Amount of results to skip',
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumberString()
  offset: string;

  @ApiProperty({
    example: 'approved',
    description: 'Status of application',
    required: false,
  })
  @IsOptional()
  @IsEnum(Status)
  status: Status;

  @ApiProperty({
    example: 'installation',
    description: 'Query for searching between applications',
    required: false,
  })
  @IsOptional()
  @IsString()
  q: string;
}
