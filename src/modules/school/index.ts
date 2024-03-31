import { Module } from "@nestjs/common";
import SchoolRepository from "./repository";
import RedisModule from "../redis";
import SchoolService from "./service";
import { SchoolController } from "./controller";

@Module({
    imports: [RedisModule],
    controllers: [SchoolController],
    providers: [
        SchoolService,
        SchoolRepository,
    ]
})
export default class SchoolModule {}