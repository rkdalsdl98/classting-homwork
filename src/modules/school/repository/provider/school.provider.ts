import PrismaService from "../../../../common/prisma"

import { Logger } from "@nestjs/common"
import { Prisma, PrismaClient } from "@prisma/client"
import { DefaultArgs, PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { NewsProvider } from "./news.provider"
import { SchoolEntity } from "../entity"

const logger: Logger = new Logger("SchoolProvider")

export namespace SchoolProvider {
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
        (obj: Prisma.schoolGetPayload<ReturnType<typeof select>>) : SchoolEntity => ({
            uuid: obj.uuid.trim(),
            region: obj.region.trim(),
            name: obj.name.trim(),
            news: obj.news.map(NewsProvider.Entity.toJson),
        } satisfies SchoolEntity)

        export const select = () => Prisma.validator<Prisma.schoolFindManyArgs>()({
            include: { news: NewsProvider.Entity.select() } as const
        })

        export const findMany = async (
            tx?: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
        ) : Promise<SchoolEntity[]> => await (tx ?? PrismaService.prisma)
        .school
        .findMany({
            include: { 
                news: {
                    include: { detail: true }
                } 
            }
        })
        .then(entities => entities.map(toJson))
        .catch(Exception.handle)

        export const create = async (
            args: Prisma.schoolCreateArgs,
            tx?: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
        ) : Promise<boolean> => await (tx ?? PrismaService.prisma)
        .school
        .create(args)
        .then(entity => !!entity)
        .catch(Exception.handle)

        export const remove = async (
            args: Prisma.schoolDeleteArgs,
            tx?: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
        ) => await (tx ?? PrismaService.prisma)
        .school
        .delete(args)
        .then(entity => !!entity)
        .catch(Exception.handle)
    }
}