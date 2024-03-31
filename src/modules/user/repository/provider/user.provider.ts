import PrismaService from "../../../../common/prisma"
import { UserEntity } from "../entity"

import { Logger } from "@nestjs/common"
import { Prisma, PrismaClient } from "@prisma/client"
import { DefaultArgs, PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

const logger: Logger = new Logger("UserProvider")

export namespace UserProvider {
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
        (obj: Prisma.userGetPayload<ReturnType<typeof select>>) : UserEntity => ({
            email: obj.email.trim(),
            pass: obj.pass.trim(),
            salt: obj.salt.trim(),
            authority: obj.authority,
            subschool: obj.subschool.map(school => school.trim()),
        } satisfies UserEntity)

        export const select = () => Prisma.validator<Prisma.userFindManyArgs>()({} as const)

        export const findUnique = async (
            args: Prisma.userFindUniqueArgs,
            tx?: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
        ) : Promise<UserEntity> => await (tx ?? PrismaService.prisma)
        .user
        .findUnique(args)
        .then(toJson)
        .catch(Exception.handle)

        export const findMany = async (
            args: Prisma.userFindManyArgs,
            tx?: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
        ) : Promise<string[]> => await (tx ?? PrismaService.prisma)
        .user
        .findMany(args)
        .then(entities => entities.map(entity => entity.email))
        .catch(Exception.handle)

        export const create = async (
            args: Prisma.userCreateArgs,
            tx?: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
        ) : Promise<boolean> => await (tx ?? PrismaService.prisma)
        .user
        .create(args)
        .then(entity => !!entity)
        .catch(Exception.handle)

        export const update = async (
            args: Prisma.userUpdateArgs,
            tx?: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
        ) : Promise<boolean> => await (tx ?? PrismaService.prisma)
        .user
        .update(args)
        .then(entity => !!entity)
        .catch(Exception.handle)
    }
}