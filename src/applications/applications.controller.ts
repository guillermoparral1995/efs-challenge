import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationDto } from './dto/application.dto';
import { FindAllQueryDto } from './dto/findAllQuery.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Application } from './entities/application.entity';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @ApiOperation({
    summary: 'Create application',
  })
  @ApiResponse({
    status: 201,
    description: 'OK',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid arguments in body',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Application with same name exists',
  })
  @Post()
  create(@Body() createApplicationDto: ApplicationDto): Promise<Application> {
    return this.applicationsService.create(createApplicationDto);
  }

  @ApiOperation({
    summary: 'Get application by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid ID param',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<Application> {
    return this.applicationsService.findById(id);
  }

  @ApiOperation({
    summary: 'Get applications by filter',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid query params',
  })
  @Get()
  findAll(
    @Query(ValidationPipe) query: FindAllQueryDto,
  ): Promise<Application[]> {
    return this.applicationsService.findAll(query);
  }

  @ApiOperation({
    summary: 'Update application',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid arguments in body or param',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Application with same name exists',
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateApplicationDto: ApplicationDto,
  ): Promise<Application> {
    return this.applicationsService.update(id, updateApplicationDto);
  }

  @ApiOperation({
    summary: 'Create application',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid arguments in param',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Application> {
    return this.applicationsService.remove(id);
  }
}
