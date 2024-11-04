import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {
  create_201_response,
  create_201WithStatus_response,
  create_400InvalidStatus_error,
  create_400NoDescription_error,
  create_400NoName_error,
  create_409_error,
  delete_200_response,
  delete_404_response,
  findAll_invalidLimitAndOffset_error,
  findAll_invalidStatus_error,
  findAll_noQueryParams_response,
  findAll_onlyApproved_response,
  findAll_onlyApprovedWithQuery_response,
  findAll_onlyApprovedWithQueryAndLimitAndOffset_response,
  findAll_withLimit_response,
  findAll_withLimitAndOffset_response,
  findAll_withOffset_response,
  findById_200_response,
  findById_400_error,
  findById_404_error,
  update_200_response,
  update_200WithStatus_response,
} from './fixtures';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ApplicationsController - (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
  });

  it('should return 404 for invalid URL', () => {
    return request(app.getHttpServer()).get('/random').expect(404).expect({
      message: 'Cannot GET /random',
      error: 'Not Found',
      statusCode: 404,
    });
  });

  it('should return 500 if error is thrown from Prisma', async () => {
    class MockPrismaService {
      application = {
        findMany: jest.fn().mockImplementation(() => {
          throw new Error('Database connection lost');
        }),
      };
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useClass(MockPrismaService)
      .compile();

    const app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    return request(app.getHttpServer())
      .get('/applications')
      .expect(500)
      .expect({ statusCode: 500, message: 'Internal server error' });
  });

  describe('GET /applications', () => {
    it('should return first page of results without query params', () => {
      return request(app.getHttpServer())
        .get('/applications')
        .expect(200)
        .expect(findAll_noQueryParams_response);
    });

    it('should return second page with specified offset', () => {
      return request(app.getHttpServer())
        .get('/applications?offset=10')
        .expect(200)
        .expect(findAll_withOffset_response);
    });

    it('should return first page with specified limit', () => {
      return request(app.getHttpServer())
        .get('/applications?limit=5')
        .expect(200)
        .expect(findAll_withLimit_response);
    });

    it('should return second page with specified offset and limit', () => {
      return request(app.getHttpServer())
        .get('/applications?limit=5&offset=15')
        .expect(200)
        .expect(findAll_withLimitAndOffset_response);
    });

    it('should return only approved applications', () => {
      return request(app.getHttpServer())
        .get('/applications?status=approved')
        .expect(200)
        .expect(findAll_onlyApproved_response);
    });

    it('should return only approved applications that match query', () => {
      return request(app.getHttpServer())
        .get('/applications?status=approved&q=installation')
        .expect(200)
        .expect(findAll_onlyApprovedWithQuery_response);
    });

    it('should return only approved applications that match query with limit and offset', () => {
      return request(app.getHttpServer())
        .get('/applications?status=approved&q=installation&limit=2&offset=1')
        .expect(200)
        .expect(findAll_onlyApprovedWithQueryAndLimitAndOffset_response);
    });

    it('should return empty array if no results', () => {
      return request(app.getHttpServer())
        .get('/applications?q=blabla')
        .expect(200)
        .expect([]);
    });

    it('should return 400 error if status is not valid', () => {
      return request(app.getHttpServer())
        .get('/applications?status=invalid')
        .expect(400)
        .expect(findAll_invalidStatus_error);
    });

    it('should return 400 error if limit and offset are not valid', () => {
      return request(app.getHttpServer())
        .get('/applications?limit=invalid&offset=invalid')
        .expect(400)
        .expect(findAll_invalidLimitAndOffset_error);
    });
  });

  describe('GET /applications/:id', () => {
    it('should return application with param id', () => {
      return request(app.getHttpServer())
        .get('/applications/3')
        .expect(200)
        .expect(findById_200_response);
    });

    it('should return 404 error if there is no application with param id', () => {
      return request(app.getHttpServer())
        .get('/applications/300')
        .expect(404)
        .expect(findById_404_error);
    });

    it('should return 400 error if param id is invalid', () => {
      return request(app.getHttpServer())
        .get('/applications/blabla')
        .expect(400)
        .expect(findById_400_error);
    });
  });

  describe('POST /applications', () => {
    it('should create new application successfully', () => {
      return request(app.getHttpServer())
        .post('/applications')
        .send({
          name: 'My new application',
          description: 'Adding a new application to test',
        })
        .expect(201)
        .expect(create_201_response);
    });

    it('should create new application successfully with status', () => {
      return request(app.getHttpServer())
        .post('/applications')
        .send({
          name: 'My new application with status',
          description: 'Adding a new application to test with status',
          status: 'rejected',
        })
        .expect(201)
        .expect(create_201WithStatus_response);
    });

    it('should return 400 error if creating without name', () => {
      return request(app.getHttpServer())
        .post('/applications')
        .send({
          description: 'Adding a new application to test with status',
        })
        .expect(400)
        .expect(create_400NoName_error);
    });

    it('should return 400 error if creating without description', () => {
      return request(app.getHttpServer())
        .post('/applications')
        .send({
          name: 'My new application',
        })
        .expect(400)
        .expect(create_400NoDescription_error);
    });

    it('should return 400 error if creating with invalid status', () => {
      return request(app.getHttpServer())
        .post('/applications')
        .send({
          name: 'My new application with status',
          description: 'Adding a new application to test with status',
          status: 'invalid',
        })
        .expect(400)
        .expect(create_400InvalidStatus_error);
    });

    it('should return 409 error if creating an application with the same name as an existing one', () => {
      return request(app.getHttpServer())
        .post('/applications')
        .send({
          name: 'Hybrid Heat Pump Installation',
          description: 'Adding a new application to test with status',
        })
        .expect(409)
        .expect(create_409_error);
    });
  });

  describe('PUT /applications/:id', () => {
    it('should update application successfully', () => {
      return request(app.getHttpServer())
        .put('/applications/27')
        .send({
          name: 'Updated application',
          description: 'New updated application',
        })
        .expect(200)
        .expect(update_200_response);
    });

    it('should update application successfully with new status', () => {
      return request(app.getHttpServer())
        .put('/applications/27')
        .send({
          name: 'Updated application',
          description: 'New updated application',
          status: 'rejected',
        })
        .expect(200)
        .expect(update_200WithStatus_response);
    });

    it('should return 400 error if updating without name', () => {
      return request(app.getHttpServer())
        .put('/applications/27')
        .send({
          description: 'New updated application',
        })
        .expect(400)
        .expect(create_400NoName_error);
    });

    it('should return 400 error if updating without description', () => {
      return request(app.getHttpServer())
        .put('/applications/27')
        .send({
          name: 'Updated application',
        })
        .expect(400)
        .expect(create_400NoDescription_error);
    });

    it('should return 400 error if updating with invalid status', () => {
      return request(app.getHttpServer())
        .put('/applications/27')
        .send({
          name: 'Updated application',
          description: 'New updated application',
          status: 'invalid',
        })
        .expect(400)
        .expect(create_400InvalidStatus_error);
    });

    it('should return 400 error if param id is invalid', () => {
      return request(app.getHttpServer())
        .put('/applications/blabla')
        .send({
          name: 'Updated application',
          description: 'New updated application',
        })
        .expect(400)
        .expect(findById_400_error);
    });

    it('should return 409 error if updating an application with the same name as an existing one', () => {
      return request(app.getHttpServer())
        .put('/applications/27')
        .send({
          name: 'Hybrid Heat Pump Installation',
          description: 'New updated application',
        })
        .expect(409)
        .expect(create_409_error);
    });
  });

  describe('DELETE /applications/:id', () => {
    it('should delete application successfully', () => {
      return request(app.getHttpServer())
        .delete('/applications/31')
        .expect(200)
        .expect(delete_200_response);
    });

    it('should return 404 error if application with param id is not found', () => {
      return request(app.getHttpServer())
        .delete('/applications/31')
        .expect(404)
        .expect(delete_404_response);
    });

    it('should return 400 error if param id is invalid', () => {
      return request(app.getHttpServer())
        .delete('/applications/blabla')
        .expect(400)
        .expect(findById_400_error);
    });
  });
});
