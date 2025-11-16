import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';

import { User } from '../src/common/database/models/user.models';
import { UpdateUserDto } from '../src/modules/users/dto/update-user.dto';

import { TestAppHelper } from './helpers/test-app.helper';
import { TestDataHelper } from './helpers/test-data.helper';

describe('Users Module (e2e)', () => {
   let app: INestApplication;

   const getHttpAppServer = (): App => app.getHttpServer() as App;

   beforeAll(async () => {
      app = await TestAppHelper.createTestApp();
   });

   afterAll(async () => {
      await TestAppHelper.closeApp();
   });

   beforeEach(async () => {
      await TestAppHelper.cleanDatabase();
   });

   describe('/users (POST)', () => {
      it('should create a new user with valid data', async () => {
         const createUserDto = TestDataHelper.createValidUser();

         const response = await request(getHttpAppServer())
            .post('/users')
            .send(createUserDto)
            .expect(HttpStatus.CREATED);

         expect(response.body).toHaveProperty('id');
         expect(response.body.email).toBe(createUserDto.email);
         expect(response.body.passwordHash).toContain('hash_');
         expect(response.body).not.toHaveProperty('password');
      });

      it('should reject user creation with invalid email', async () => {
         const response = await request(getHttpAppServer())
            .post('/users')
            .send({ email: 'invalidemail', password: 'ValidPassword123' })
            .expect(HttpStatus.BAD_REQUEST);

         expect(response.body.message).toContain('email must be an email');
      });

      it('should reject user creation with short password', async () => {
         const response = await request(getHttpAppServer())
            .post('/users')
            .send({ email: 'valid@example.com', password: '123' })
            .expect(HttpStatus.BAD_REQUEST);

         expect(response.body.message).toContain('password must be longer than or equal to 6 characters');
      });

      it('should reject user creation with missing fields', async () => {
         const response = await request(getHttpAppServer())
            .post('/users')
            .send({ email: 'test@example.com' })
            .expect(HttpStatus.BAD_REQUEST);

         expect(response.body.message).toContain('password should not be empty');
      });

      it('should handle duplicate email gracefully', async () => {
         const userDto = TestDataHelper.createValidUser();

         await request(getHttpAppServer()).post('/users').send(userDto).expect(HttpStatus.CREATED);
         await request(getHttpAppServer()).post('/users').send(userDto).expect(HttpStatus.CONFLICT);
      });

      it('should sanitize extra fields', async () => {
         const response = await request(getHttpAppServer())
            .post('/users')
            .send({ ...TestDataHelper.createValidUser(), extra: 'field', admin: true, role: 'admin' })
            .expect(HttpStatus.BAD_REQUEST);

         expect(response.body.message).toContain('property extra should not exist');
      });
   });

   describe('/users (GET)', () => {
      beforeEach(async () => {
         for (const user of TestDataHelper.createMultipleUsers(3)) {
            await request(getHttpAppServer()).post('/users').send(user);
         }
      });

      it('should return all users', async () => {
         const response = await request(getHttpAppServer()).get('/users').expect(HttpStatus.OK);

         expect(response.body).toBeInstanceOf(Array);
         expect(response.body).toHaveLength(3);
         response.body.forEach((user: User) => {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('passwordHash');
            expect(user).not.toHaveProperty('password');
         });
      });

      it('should return empty array when no users exist', async () => {
         await TestAppHelper.cleanDatabase();
         expect((await request(getHttpAppServer()).get('/users').expect(HttpStatus.OK)).body).toEqual([]);
      });

      it('should handle large number of users', async () => {
         await TestAppHelper.cleanDatabase();

         for (const user of TestDataHelper.createMultipleUsers(50)) {
            await request(getHttpAppServer()).post('/users').send(user);
         }

         const response = await request(getHttpAppServer()).get('/users').expect(HttpStatus.OK);
         expect(response.body).toHaveLength(50);
      });
   });

   describe('/users/:id (GET)', () => {
      let userId: string;

      beforeEach(async () => {
         const userDto = TestDataHelper.createValidUser();
         const response = await request(getHttpAppServer()).post('/users').send(userDto);

         userId = response.body.id as string;
      });

      it('should return a user by valid id', async () => {
         const response = await request(getHttpAppServer()).get(`/users/${userId}`).expect(HttpStatus.OK);

         expect(response.body).toHaveProperty('id', userId);
         expect(response.body).toHaveProperty('email');
         expect(response.body).toHaveProperty('passwordHash');
      });

      it('should return null for non-existent user', async () => {
         const response = await request(getHttpAppServer())
            .get(`/users/00000000-0000-0000-0000-000000000000`)
            .expect(HttpStatus.OK);
         expect(response.body).toEqual({});
      });

      it('should handle invalid UUID format', async () => {
         const response = await request(getHttpAppServer()).get(`/users/invalid-uuid`).expect(HttpStatus.OK);
         expect(response.body).toEqual({});
      });

      it('should handle empty id parameter', async () => {
         const response = await request(getHttpAppServer()).get('/users/').expect(HttpStatus.OK);

         expect(response.body).toBeInstanceOf(Array);
      });
   });

   describe('/users/:id (PATCH)', () => {
      let userId: string;
      let userEmail: string;

      beforeEach(async () => {
         const userDto = TestDataHelper.createValidUser();
         userEmail = userDto.email;

         const response = await request(getHttpAppServer()).post('/users').send(userDto);

         userId = response.body.id as string;
      });

      it('should update user email and password', async () => {
         const updateDto: UpdateUserDto = {
            email: 'newemail@example.com',
            password: 'NewPassword456',
         };

         const response = await request(getHttpAppServer())
            .patch(`/users/${userId}`)
            .send(updateDto)
            .expect(HttpStatus.OK);

         expect(response.body.id).toBe(userId);
         expect(response.body.email).toBe(updateDto.email);
         expect(response.body.passwordHash).toContain('hash_');
         expect(response.body.passwordHash).not.toBe('hash_ValidPassword123');
      });

      it('should update only email', async () => {
         const updateDto: UpdateUserDto = {
            email: 'onlyemail@example.com',
         };

         const response = await request(getHttpAppServer())
            .patch(`/users/${userId}`)
            .send(updateDto)
            .expect(HttpStatus.OK);

         expect(response.body.email).toBe(updateDto.email);
         expect(response.body.id).toBe(userId);
      });

      it('should update only password', async () => {
         const updateDto: UpdateUserDto = {
            password: 'OnlyPassword789',
         };

         const response = await request(getHttpAppServer())
            .patch(`/users/${userId}`)
            .send(updateDto)
            .expect(HttpStatus.OK);

         expect(response.body.email).toBe(userEmail);
         expect(response.body.passwordHash).toContain('hash_OnlyPassword789');
      });

      it('should handle empty update DTO', async () => {
         const response = await request(getHttpAppServer()).patch(`/users/${userId}`).send({}).expect(HttpStatus.OK);

         expect(response.body.id).toBe(userId);
         expect(response.body.email).toBe(userEmail);
      });

      it('should return null when updating non-existent user', async () => {
         const updateDto: UpdateUserDto = {
            email: 'test@example.com',
         };

         const response = await request(getHttpAppServer())
            .patch(`/users/00000000-0000-0000-0000-000000000000`)
            .send(updateDto)
            .expect(HttpStatus.OK);

         expect(response.body).toEqual({});
      });

      it('should validate email format on update', async () => {
         const updateDto = {
            email: 'invalid-email',
         };

         const response = await request(getHttpAppServer())
            .patch(`/users/${userId}`)
            .send(updateDto)
            .expect(HttpStatus.BAD_REQUEST);

         expect(response.body.message).toContain('email must be an email');
      });

      it('should validate password length on update', async () => {
         const updateDto = {
            password: '123',
         };

         const response = await request(getHttpAppServer())
            .patch(`/users/${userId}`)
            .send(updateDto)
            .expect(HttpStatus.BAD_REQUEST);

         expect(response.body.message).toContain('password must be longer than or equal to 6 characters');
      });

      it('should reject extra fields on update', async () => {
         const updateDto = {
            email: 'valid@example.com',
            extra: 'field',
         };

         const response = await request(getHttpAppServer())
            .patch(`/users/${userId}`)
            .send(updateDto)
            .expect(HttpStatus.BAD_REQUEST);

         expect(response.body.message).toContain('property extra should not exist');
      });
   });

   describe('/users/:id (DELETE)', () => {
      let userId: string;

      beforeEach(async () => {
         const userDto = TestDataHelper.createValidUser();
         const response = await request(getHttpAppServer()).post('/users').send(userDto);

         userId = response.body.id as string;
      });

      it('should successfully delete an existing user', async () => {
         const checkResponse = await request(getHttpAppServer()).get(`/users/${userId}`).expect(HttpStatus.OK);
         expect(checkResponse.body).toHaveProperty('id', userId);

         const response = await request(getHttpAppServer()).delete(`/users/${userId}`).expect(HttpStatus.OK);
         // API returns {} for boolean true/success in this setup
         expect(response.body).toEqual({});

         // Verify user is deleted
         const getResponse = await request(getHttpAppServer()).get(`/users/${userId}`).expect(HttpStatus.OK);
         expect(getResponse.body).toEqual({});
      });

      it('should return false when deleting non-existent user', async () => {
         const response = await request(getHttpAppServer())
            .delete(`/users/00000000-0000-0000-0000-000000000000`)
            .expect(HttpStatus.OK);

         expect(response.body).toEqual({});
      });

      it('should handle deleting already deleted user', async () => {
         await request(getHttpAppServer()).delete(`/users/${userId}`).expect(HttpStatus.OK);

         const response = await request(getHttpAppServer()).delete(`/users/${userId}`).expect(HttpStatus.OK);
         expect(response.body).toEqual({});
      });
   });

   describe('Database Integration', () => {
      it('should persist users in database', async () => {
         const userDto = TestDataHelper.createValidUser();
         const response = await request(getHttpAppServer()).post('/users').send(userDto);

         const user = await User.findByPk(response.body.id as string);
         expect(user).not.toBeNull();
         expect(user?.email).toBe(userDto.email);
      });

      it('should handle concurrent user creation', async () => {
         const users = TestDataHelper.createMultipleUsers(10);

         const promises = users.map((user) => request(getHttpAppServer()).post('/users').send(user));
         const responses = await Promise.all(promises);

         responses.forEach((response) => {
            expect(response.status).toBe(HttpStatus.CREATED);
         });

         expect(await User.findAll()).toHaveLength(10);
      });

      it('should rollback on database errors', async () => {
         const countBefore = await User.count();

         const userDto = TestDataHelper.createValidUser();
         await request(getHttpAppServer()).post('/users').send(userDto);
         await request(getHttpAppServer()).post('/users').send(userDto).expect(HttpStatus.CONFLICT);

         expect(await User.count()).toBe(countBefore + 1);
      });
   });

   describe('Performance Tests', () => {
      it('should handle rapid sequential requests', async () => {
         const startTime = Date.now();
         const requestCount = 20;

         for (let i = 0; i < requestCount; i++) {
            await request(getHttpAppServer()).get('/users').expect(HttpStatus.OK);
         }

         const endTime = Date.now();
         const duration = endTime - startTime;

         expect(duration).toBeLessThan(5000);
      });

      it('should handle concurrent requests efficiently', async () => {
         const startTime = Date.now();

         const promises = Array.from({ length: 20 }, () => request(getHttpAppServer()).get('/users'));
         const responses = await Promise.all(promises);
         const duration = Date.now() - startTime;

         responses.forEach((response) => {
            expect(response.status).toBe(HttpStatus.OK);
         });

         expect(duration).toBeLessThan(2000);
      });
   });
});
