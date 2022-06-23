import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DBOptions } from 'db.datasourceoptions';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    UsersModule,
    ReportsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const dbOptions: TypeOrmModuleOptions = {};
        Object.assign(dbOptions, DBOptions);
        return dbOptions;
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, //*strips off the additional property beyond the DTO class
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  //configure globally scoped variable
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get<string>('COOKIE_KEY')], //used to encrypt the info in cookie
        }),
      )
      .forRoutes('*'); //make use of the middleware on all routes
  }
}
