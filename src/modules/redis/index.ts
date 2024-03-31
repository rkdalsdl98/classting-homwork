import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import * as redisStore from 'cache-manager-ioredis';
import RedisService from "./service";

@Module({
    imports: [
        CacheModule.register({
            store: redisStore,
            host: "127.0.0.1",
            port: 6379,
            isGlobal: true,
        })
    ],
    providers: [RedisService],
    exports: [RedisService],
})
export default class RedisModule {}