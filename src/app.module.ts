import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

@Module({
  imports: [
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      synchronize: true, //*only true in dev, via this setting the ORM and nest syncs the DB with changes in the entity file, same thing is achived via migrations with real prod DB's
    }), //this connection is going to be shared bettwen all the modules
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
