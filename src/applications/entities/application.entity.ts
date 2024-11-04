import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class Application {
  @ApiProperty({
    example: 1,
    description: 'ID of application',
  })
  id: number;

  @ApiProperty({
    example: 'Heat Pump Installation',
    description: 'Name of application',
  })
  name: string;

  @ApiProperty({
    example: 'Installation of heat pumps at your home',
    description: 'Description of application',
  })
  description: string;

  @ApiProperty({
    example: 'approved',
    description: 'Status of application',
  })
  status: Status;
}
