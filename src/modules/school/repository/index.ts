import { 
    SchoolProvider,
    NewsProvider,
    NewsDetailProvider,
} from "./provider"
import { UserProvider } from "../../user/repository/provider";
import { 
    CreateNewsArgs, 
    CreateSchoolArgs, 
    DeleteNewsArgs, 
    DeleteSchoolArgs, 
    FindNewsDetailArgs, 
    LookUpNewsArgs, 
    UpdateNewsArgs, 
    UpdateNewsDetailViews
} from "./type";
import PrismaService from "../../../common/prisma";
import { NewsDetailEntity, NewsEntity, SchoolEntity } from "./entity";

import { Injectable } from "@nestjs/common";
import { NewsDetailCache } from "../domain/type";
import { NewsFeedProvider } from "./provider/news_feed.provider";

@Injectable()
export default class SchoolRepository {

    constructor(){
        //this.clear()
    }
    async clear() {
        await PrismaService.prisma.news.deleteMany()
    }

    public async saveDetailCaches(caches: NewsDetailCache[]) : Promise<void> {
        await PrismaService.prisma.$transaction(async tx => {
            for(let i=0; i<caches.length; ++i) {
                await tx
                .newsdetail
                .update({
                    where: { uuid: caches[i].id },
                    data: { 
                        views: caches[i].now_views,
                        updatedAt: new Date(caches[i].updatedAt),
                    }
                })
            }
        })
    }

    /**
     * 
     * @param input 
     * @returns 등록 된 학교 페이지를 반환 합니다.
     * 
     * 실패 시 로그 처리만 하고 사용자에게 빈 배열을 반환 합니다.
     */
    public async lookUpSchools() : Promise<SchoolEntity[]> {
        return await SchoolProvider
        .Entity
        .findMany()
    }

    /**
     * 
     * @param input 
     * @returns 학교 페이지의 소식을 반환 합니다.
     * 
     * 실패 시 로그 처리만 하고 사용자에게 빈 배열을 반환 합니다.
     */
    public async lookUpNews(input: LookUpNewsArgs) : Promise<NewsEntity[]> {
        return await NewsProvider
        .Entity
        .findMany({
            where: input.school_name
            ? {
                school: { name: input.school_name }
              }
            : {},
            orderBy: { createdAt: input.desc ? "desc" : "asc" },
            include: { detail: true }
        })
    }

    /**
     * 
     * @param input 
     * @returns 소식의 상세정보를 반환 합니다.
     * 
     * 실패 시 로그 처리만 하고 사용자에게 제약 조건 확인 메세지를 반환 합니다.
     */
    public async findNewsDetail(input: FindNewsDetailArgs) : Promise<NewsDetailEntity> {
        return await NewsDetailProvider
        .Entity
        .findUnique({ where: { uuid: input.detail_id } })
    }

    /**
     * 
     * @param input 
     * @returns 학교 페이지 생성 여부를 반환 합니다.
     * 
     * 실패 시 로그 처리만 하고 사용자에게 제약 조건 확인 메세지를 반환 합니다.
     */
    public async registerSchool(input: CreateSchoolArgs) : Promise<boolean> {
        return await PrismaService.prisma.$transaction<boolean>(async tx => {
            try {
                const authCondition = await UserProvider
                .Entity
                .findUnique({ where: { email: input.register_email } }, tx)
                .then(user => user.authority === 1004)

                if(authCondition) {
                    return await SchoolProvider
                    .Entity
                    .create({
                        data: {
                            name: input.school_name,
                            region: input.region,
                        },
                        include: { news: false }
                    }, tx)
                }
                return false
            } catch(e) { return false }
        })
    }

    /**
     * 
     * @param input 
     * @returns 학교 페이지 삭제 여부를 반환 합니다.
     * 
     * 실패 시 로그 처리만 하고 사용자에게 제약 조건 확인 메세지를 반환 합니다.
     */
    public async deleteSchool(input: DeleteSchoolArgs) : Promise<boolean> {
        return await PrismaService.prisma.$transaction<boolean>(async tx => {
            try {
                const authCondition = await UserProvider
                .Entity
                .findUnique({ where: { email: input.register_email } }, tx)
                .then(user => user.authority === 1004)

                if(authCondition) {
                    return await SchoolProvider
                    .Entity
                    .remove({
                        where: { name: input.school_name }
                    }, tx)
                }
                return false
            } catch(e) { return false }
        })
    }

    /**
     * 
     * @param input 
     * @returns 학교 소식 발행 여부와 피드 생성이 올바르게 되었는지를 반환 합니다.
     * 
     * 실패 시 로그 처리만 하고 사용자에게 제약 조건 확인 메세지를 반환 합니다.
     */
    public async registerNews(input: CreateNewsArgs) : Promise<boolean> {
        return await PrismaService.prisma.$transaction<boolean>(async tx => {
            try {
                const authCondition = await UserProvider
                .Entity
                .findUnique({ where: { email: input.register_email } }, tx)
                .then(user => user.authority === 1004)

                if(authCondition) {
                    const newsEntity = await NewsProvider
                    .Entity
                    .create({
                        data: {
                            title: input.title,
                            school: {
                                connect: { name: input.school_name }
                            },
                            detail: {
                                create: { contents: input.contents }
                            }
                        },
                        include: { detail: true }
                    }, tx)

                    const queries = await UserProvider
                    .Entity
                    .findMany({
                        where: {
                            subschool: { has: input.school_name }
                        }
                    }, tx)
                    .then(emails => emails.map(email => ({
                        email,
                        newsId: newsEntity.uuid,
                        schoolname: input.school_name,
                    })))

                    return queries.length > 0 
                    ? await NewsFeedProvider
                    .Entity
                    .createMany({ data: queries }, tx)
                    .then(created => created === queries.length)
                    : true
                }
                return false
            } catch(e) { return false }
        })
    }

    /**
     * 
     * @param input 
     * @returns 학교 소식 정보 갱신 여부를 반환 합니다.
     * 
     * 실패 시 로그 처리만 하고 사용자에게 제약 조건 확인 메세지를 반환 합니다.
     */
    public async updateNews(input: UpdateNewsArgs) : Promise<boolean> {
        return await PrismaService.prisma.$transaction<boolean>(async tx => {
            try {
                const authCondition = await UserProvider
                .Entity
                .findUnique({ where: { email: input.register_email } }, tx)
                .then(user => user.authority === 1004)

                if(authCondition) {
                    return await NewsProvider
                    .Entity
                    .update({
                        data: {
                            title: input.title,
                            detail: {
                                update: { contents: input.contents }
                            }
                        },
                        where: { uuid: input.newsId }
                    })
                }
                return false 
            } catch(e) { return false }
        }) 
    }

    public async updateNewsDetailViews(input: UpdateNewsDetailViews) : Promise<NewsDetailEntity> {
        return await NewsDetailProvider
        .Entity
        .update({
            where: { uuid: input.detail_id },
            data: { 
                views: input.views,
                updatedAt: input.updatedAt,
            }
        })
    }

    /**
     * 
     * @param input 
     * @returns 학교 소식 삭제 여부를 반환 합니다.
     * 
     * 실패 시 로그 처리만 하고 사용자에게 제약 조건 확인 메세지를 반환 합니다.
     */
    public async deleteNews(input: DeleteNewsArgs) : Promise<boolean> {
        return await PrismaService.prisma.$transaction<boolean>(async tx => {
            try {
                const authCondition = await UserProvider
                .Entity
                .findUnique({ where: { email: input.register_email } }, tx)
                .then(user => user.authority === 1004)

                if(authCondition) {
                    return await NewsProvider
                    .Entity
                    .remove({ where: { uuid: input.newsId }})
                }
                return false
            } catch(e) { return false }
        })
    }
}