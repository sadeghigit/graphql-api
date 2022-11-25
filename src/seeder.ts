import { NestFactory } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AppModule } from './app.module';
import { UserRole } from './users/schemas/user.schema';
import { faker } from '@faker-js/faker';
import { SessionsService } from './sessions/sessions.service';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const connection = app.get<Connection>(getConnectionToken());
  await connection.db.dropDatabase();

  const usersService = app.get<UsersService>(UsersService);
  const sessionsService = app.get<SessionsService>(SessionsService);

  for (let i = 0; i < 100; i++) {
    const user = await usersService.createUser({
      mobile: faker.phone.number('09#########'),
      password: '123456',
      role: faker.helpers.arrayElement([UserRole.USER, UserRole.ADMIN]),
      name: faker.name.fullName(),
    });
    for (let i = 0; i < 3; i++) {
      await sessionsService.createSession({ user: user._id });
    }
  }

  app.close();
}

bootstrap();
