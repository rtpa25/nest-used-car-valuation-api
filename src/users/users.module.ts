import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], //creates repositoy from entity
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    { useClass: CurrentUserInterceptor, provide: APP_INTERCEPTOR }, //makes the currentUserInteceptor globally scoped hence all controllers recive the updated request object
  ],
})
export class UsersModule {}
