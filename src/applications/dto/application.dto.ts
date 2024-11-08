import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApplicationDto {
  @ApiProperty({
    example: 'Heat Pump Installation',
    description: 'Name of application',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Installation of heat pumps at your home',
    description: 'Description of application',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'approved',
    description: 'Status of application',
    enum: Status,
    required: false,
  })
  @IsOptional()
  @IsEnum(Status)
  status: Status;
}
