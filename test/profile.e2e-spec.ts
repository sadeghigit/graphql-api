import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import gql from 'graphql-tag'
import request from 'supertest-graphql'
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { UsersService } from '../src/users/users.service';
import { AuthService } from '../src/auth/auth.service';
import { UserRole } from '../src/users/schemas/user-role.enum';

describe('Profile Module (e2e)', () => {
  let app: INestApplication;
  let userId: string;
  let authorization: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const connection = app.get<Connection>(getConnectionToken())
    await connection.dropDatabase()

    const usersService = app.get(UsersService)
    const authService = app.get(AuthService)

    const admin = await usersService.createUser({
      mobile: "09210000000", password: "123456",
      userRole: UserRole.MEMBER,
      imageUrl: "/users/user-image/id.jpg"
    })

    const accessToken = authService.getAccessToken(admin, 3600)
    authorization = "Bearer " + accessToken
  });

  afterAll(async () => {
    await app.close();
  })


  it('Get Profile Query', async () => {
    const result = await request<any>(app.getHttpServer())
      .query(gql`
        query { getProfile {id, createdAt, updatedAt, mobile, userRole, imageUrl} }
      `)
      .set('authorization', authorization)
      .expectNoErrors()
    expect(result.data.getProfile.mobile).toBe("09210000000")
  });


  it('Update Profile Mutation', async () => {
    const result = await request<any>(app.getHttpServer())
      .mutate(gql`
        mutation{
          updateProfile(input:{
            mobile:"09210000001", password:"111111",
            imageUrl:"/users/user-image/id.jpg"
        })
        }
      `)
      .set('authorization', authorization)
      .expectNoErrors()
    expect(result.data.updateProfile).toBe(true)
  });


});
