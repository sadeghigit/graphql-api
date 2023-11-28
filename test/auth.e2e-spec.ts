import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import gql from 'graphql-tag'
import request from 'supertest-graphql'
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { UsersService } from '../src/users/users.service';


describe('Auth Module (e2e)', () => {
  let app: INestApplication;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const connection = app.get<Connection>(getConnectionToken())
    await connection.dropDatabase()

    const usersService = app.get(UsersService)
    await usersService.createUser({ mobile: "09210000000", password: "123456" })
  });

  afterAll(async () => {
    await app.close();
  })

  it('Login Password Mutation', async () => {
    const result = await request<any>(app.getHttpServer())
      .mutate(gql`
        mutation {
          loginPassword(input: { mobile: "09210000000", password: "123456" }) { 
            accessToken refreshToken expiresIn }
        }      
      `)
      .expectNoErrors()
    refreshToken = result.data.loginPassword.refreshToken
    expect(refreshToken).toBeDefined()
  });

  it('Refresh Token Mutation', async () => {
    const result = await request<any>(app.getHttpServer())
      .mutate(gql`
        mutation {
          refreshToken(token :"${refreshToken}"){ 
            accessToken  expiresIn }
        }
      `)
      .expectNoErrors()
  });

});
