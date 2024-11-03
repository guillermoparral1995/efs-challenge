import { Status } from '@prisma/client';

export class ApplicationDto {
  name: string;
  description: string;
  status: Status;
}
