import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [ProfileResolver, ProfileService],
  exports: [ProfileService],
})
export class ProfileModule { }
