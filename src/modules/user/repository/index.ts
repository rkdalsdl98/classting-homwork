import { 
    CreateUserArgs, 
    LoginArgs, 
    LookUpFeedsArgs, 
    SubscribeSchoolArgs, 
    UnSubscribeSchoolArgs 
} from "./type";
import PrismaService from "../../../common/prisma";
import { UserProvider } from "./provider";
import { UserEntity } from "./entity";
import { NewsFeedEntity } from "../../school/repository/entity";

import { Injectable } from "@nestjs/common";
import { NewsFeedProvider } from "../../school/repository/provider/news_feed.provider";

@Injectable()
export default class UserRepository {
    /**
     * 
     * @param input 
     * @returns 유저 생성 여부를 반환 합니다.
     * 
     * 실패 시 로그 처리만 하고 사용자에게 제약 조건 확인 메세지를 반환 합니다.
     */
    public async registerUser(input: CreateUserArgs) : Promise<boolean> {
        return await UserProvider
        .Entity
        .create({
            data: {
                email: input.email,
                pass: input.pass,
                salt: input.salt,
            }
        })
    }

    /**
     * 
     * @param input 
     * @returns 유저 정보를 반환 합니다.
     * 
     * 실패 시 로그 처리만 하고 사용자에게 제약 조건 확인 메세지를 반환 합니다.
     */
    public async findUnique(input: Pick<LoginArgs, "email">) : Promise<UserEntity> {
        return await UserProvider
        .Entity
        .findUnique({
            where: { email: input.email }
        })
    }

    public async lookUpFeeds(input: LookUpFeedsArgs) : Promise<NewsFeedEntity[]> {
        return await NewsFeedProvider
        .Entity
        .findMany({
            where: { email: input.email },
            orderBy: {
                news: {
                    createdAt: input.desc ? "desc" : "asc"
                }
            },
            include: {
                news: {
                    include: {
                        detail: true
                    }
                }
            }
        })
    }

    /**
     * 
     * @param input 
     * @returns 학교 페이지 구독 여부를 반환 합니다.
     * 
     * 실패 시 내부 적으로는 로그를 띄우되 유저에게는 이미 구독 한 학교라고 알립니다.
     */
    public async subscribeSchool(input: SubscribeSchoolArgs) : Promise<boolean> {
        return await PrismaService.prisma.$transaction<boolean>(async tx => {
            try {
                const user = await UserProvider
                .Entity
                .findUnique({ where: { email: input.email }}, tx)

                const isAlreadySubscribe = !!(user.subschool.find(school => school === input.school_name))
                if(isAlreadySubscribe) return false
                
                return await UserProvider
                .Entity
                .update({
                    data: {
                        subschool: {
                            push: input.school_name
                        }
                    },
                    where: { email: input.email }
                }, tx)
            } catch(e) { return false }
        })
    }

    /**
     * 
     * @param input 
     * @returns 학교 페이지 구독 해지 여부를 반환 합니다.
     * 
     * 실패 시 로그 처리만 하고 사용자에게 제약 조건 확인 메세지를 반환 합니다.
     */
    public async unSubscribeSchool(input: UnSubscribeSchoolArgs) : Promise<boolean> {
        return await PrismaService.prisma.$transaction<boolean>(async tx => {
            try {
                const subschool : string[] = await UserProvider
                .Entity
                .findUnique({ where: { email: input.email }}, tx)
                .then(user => user.subschool
                    .filter(school => school !== input.school_name)
                )

                return await UserProvider
                .Entity
                .update({
                    data: {
                        subschool: { set: subschool }
                    },
                    where: { email: input.email }
                }, tx)
            } catch(e) { return false }
        })
    }
}