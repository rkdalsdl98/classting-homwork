import { Module } from "@nestjs/common";
import UserRepository from "./repository";
import UserService from "./service";
import { UserController } from "./controller";

@Module({
    imports: [],
    controllers: [UserController],
    providers: [
        UserService,
        UserRepository,
    ]
})
export default class UserModule {}