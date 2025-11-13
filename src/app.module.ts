import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DataBaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Optional (default is .env)
    }),
    DataBaseModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
}) 



export class AppModule {}
