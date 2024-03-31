import PrismaService from "../../../../common/prisma";
import { NewsFeedEntity } from "../entity";
import { NewsProvider } from "./news.provider";

import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs, PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Logger } from "@nestjs/common";

const logger: Logger = new Logger("NewsFeedProvider")

export namespace NewsFeedProvider {
    export namespace Exception {
        export const handle = (e: unknown) => {
            if(e instanceof PrismaClientKnownRequestError) {
                if(e.code >= "P1000" && e.code <= "P1999") logger.error(`DB 서버에 접근 중 오류가 발생 했습니다.\n${e.message}`)
                else if(e.code >= "P2000" && e.code <= "P2999") logger.error(`해당 테이블의 제약 조건 혹은 중복된 데이터 입력인지 확인 해주세요.\n${e.message}`)
                else logger.error(e.message)
            } else logger.error(`[데이터베이스 외의 요인으로 인한 오류]\n${e}`)
            throw new Error("403-요청을 처리하던 중, 오류가 발생했습니다.")
        }
    }
    
    export namespace Entity {
        export const toJson = (
            obj: Prisma.newsfeedGetPayload<ReturnType<typeof select>>,
        ) : NewsFeedEntity => ({
            email: obj.email.trim(),
            news: NewsProvider.Entity.toJson(obj.news),
            school_name: obj.schoolname.trim(),
        } satisfies NewsFeedEntity )

        export const select = () => Prisma.validator<Prisma.newsfeedFindManyArgs>()({
            include: {
                news: NewsProvider.Entity.select(),
            } as const
        })

        export const createMany = async (
            args: Prisma.newsfeedCreateManyArgs,
            tx?: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
        ) : Promise<number> => await (tx ?? PrismaService.prisma)
        .newsfeed
        .createMany(args)
        .then(payload => payload.count)
        .catch(Exception.handle)

        export const findMany = async (
            args: Prisma.newsfeedFindManyArgs,
            tx?: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
        ) : Promise<NewsFeedEntity[]> => await (tx ?? PrismaService.prisma)
        .newsfeed
        .findMany(args)
        .then(entities => entities.map(toJson))
        .catch(Exception.handle)
    }
}