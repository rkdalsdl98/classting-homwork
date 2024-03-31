import PrismaService from "../../../../common/prisma"

import { Logger } from "@nestjs/common"
import { Prisma, PrismaClient } from "@prisma/client"
import { DefaultArgs, PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { NewsDetailEntity } from "../entity"

const logger: Logger = new Logger("NewsDetailProvider")

export namespace NewsDetailProvider {
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
        export const toJson = 
        (obj: Prisma.newsdetailGetPayload<ReturnType<typeof select>>) : NewsDetailEntity => ({
            uuid: obj.uuid.trim(),
            views: obj.views,
            contents: obj.contents.trim(),
            updatedAt: obj.updatedAt,
        } satisfies NewsDetailEntity)

        export const select = () => Prisma.validator<Prisma.newsdetailFindManyArgs>()({
            select: {
                uuid: true,
                contents: true,
                views: true,
                updatedAt: true,
            } as const,
            include: { news: false } as const
        })

        export const update = async (
            args: Prisma.newsdetailUpdateArgs,
            tx?: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
        ) : Promise<NewsDetailEntity> => await (tx ?? PrismaService.prisma)
        .newsdetail
        .update(args)
        .then(toJson)
        .catch(Exception.handle)

        export const findUnique = async (
            args: Prisma.newsdetailFindUniqueArgs,
            tx?: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
        ) : Promise<NewsDetailEntity> => await (tx ?? PrismaService.prisma)
        .newsdetail
        .findUnique(args)
        .then(toJson)
        .catch(Exception.handle)
    }
}