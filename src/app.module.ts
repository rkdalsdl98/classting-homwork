import { Module } from '@nestjs/common';
import RedisModule from './modules/redis';
import UserModule from './modules/user';
import SchoolModule from './modules/school';

@Module({
  imports: [
    UserModule,
    SchoolModule,
    RedisModule
  ],
  exports: [
    UserModule,
    SchoolModule,
    RedisModule
  ]
})
export class AppModule {}
