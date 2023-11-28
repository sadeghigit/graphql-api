import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import gql from 'graphql-tag'
import request from 'supertest-graphql'
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('Users Module (e2e)', () => {
  let app: INestApplication;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const connection = app.get<Connection>(getConnectionToken())
    await connection.dropDatabase()
  });

  afterAll(async () => {
    await app.close();
  })

  it('Create User Mutation', async () => {
    const result = await request<any>(app.getHttpServer())
      .mutate(gql`
        mutation {
          createUser(input: { mobile: "09210000000", password: "123456", userRole:ADMIN }) {
             id createdAt, updatedAt, mobile 
          }
        }      
      `)
      .expectNoErrors()
    userId = result.data.createUser.id
    expect(userId).toBeDefined()
  });

  it('Get Users Query', async () => {
    const result = await request<any>(app.getHttpServer())
      .query(gql`
        query { getUsers{id, createdAt, updatedAt, mobile, userRole} }
      `)
      .expectNoErrors()
    expect(result.data.getUsers.length).toBe(1)
  });

  it('Get Users Count Query', async () => {
    const result = await request<any>(app.getHttpServer())
      .query(gql`
        query { getUsersCount }
      `)
      .expectNoErrors()
    expect(result.data.getUsersCount).toBe(1)
  });

  it('Get User Query', async () => {
    const result = await request<any>(app.getHttpServer())
      .query(gql`
        query {
          getUser(id:"${userId}"){id, createdAt, updatedAt, mobile, userRole} 
        }
      `)
      .expectNoErrors()
    expect(result.data.getUser.mobile).toBe("09210000000")
  });

  it('Update User Mutation', async () => {
    const result = await request<any>(app.getHttpServer())
      .mutate(gql`
        mutation{
          updateUser(id :"${userId}",input:{mobile:"09210000001", password:"111111", userRole: MEMBER})
        }
      `)
      .expectNoErrors()
    expect(result.data.updateUser).toBe(true)
  });

  it('Delete User Mutation', async () => {
    const result = await request<any>(app.getHttpServer())
      .mutate(gql`
        mutation{
          deleteUser(id :"${userId}")
        }
      `)
      .expectNoErrors()
    expect(result.data.deleteUser).toBe(true)
  });

});
