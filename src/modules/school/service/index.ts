import { 
    CreateSchoolArgs, 
    DeleteSchoolArgs,
    CreateNewsArgs,
    UpdateNewsArgs,
    DeleteNewsArgs,
    LookUpNewsArgs,
    FindNewsDetailArgs,
} from "../repository/type";
import { NewsDetailDto, NewsDto, SchoolDto } from "./dto";
import SchoolRepository from "../repository";
import RedisService from "../../redis/service";
import { NewsDetailEntity, NewsEntity, SchoolEntity } from "../repository/entity";
import { NewsDetailCache } from "../domain/type"; 

import { Injectable, OnApplicationShutdown } from "@nestjs/common";

@Injectable()
export default class SchoolService implements OnApplicationShutdown {
    constructor(
        private readonly repository: SchoolRepository,
        private readonly redis: RedisService,
    ){}

    /**
     * 서버 종료 시 캐시가 있다면 소식 상세정보를 모두 저장합니다.
     * 
     * 서버를 종료 할 때 ctrl + c로 종료하지 말고 cmd창에 close를 입력해주세요.
     * @param _ 프로세스 종료 시 받은 시그널을 담은 변수 입니다.
     * 
     * 시그널은 사용되지 않습니다.
     */
    async onApplicationShutdown(_?: string | undefined) {
        console.log("소식 상세정보 기록을 시작합니다.")
        try {
            await this.redis.get<NewsDetailCache[] | null>("details", "SchoolService")
            .then(async caches => {
                if(caches) {
                    console.log("기록이 필요한 상세정보를 찾았습니다.\n 기록을 시작합니다...")
                    await this.repository.saveDetailCaches(caches)
                }
                console.log("상세정보 기록이 끝났습니다.\n10초 뒤에 프로세스가 종료됩니다.")
                this._killProccess()
            })
        } catch(e) {
            console.log("데이터 갱신 중 오류가 발생했습니다.")
            console.log("캐시 데이터를 삭제 합니다.")
            await this.redis.reset("details")

            console.log("캐시 데이터가 삭제 되었습니다.\n10초 뒤에 프로세스가 종료됩니다.")
            this._killProccess()
        }
    }

    /**
     * 등록 된 학교 페이지를 모두 조회합니다.
     * @returns 
     */
    public async lookUpSchools() : Promise<SchoolDto[]> {
        return await this.repository.lookUpSchools()
    }

    /**
     * 발행 된 학교 소식들을 조회합니다.
     * @param input 
     * @returns 
     */
    public async lookUpNews(input: LookUpNewsArgs) : Promise<NewsDto[]> {
        return await this.repository.lookUpNews(input)
        .then(entities => entities.map(this._newsEntityToDto))
    }

    /**
     * 소식 상세정보를 조회합니다.
     * @param input 
     * @returns 
     */
    public async findNewsDetail(input: FindNewsDetailArgs) : Promise<NewsDetailDto> {
        const caches = await this.redis.get<NewsDetailCache[] | null>("details", "SchoolService")
        if(caches) {
            const detailCache = caches.find(cache => cache.id === input.detail_id)
            if(detailCache) {
                // 캐시가 존재 할 경우 현재 조회를 카운트 합니다.
                ++detailCache.now_views
                if((detailCache.standard_num * 1000) / detailCache.now_views <= 1) {
                    // 현재 조회수가 기준치에 도달 했을 경우

                    // 기준 값을 증가 시킵니다.
                    ++detailCache.standard_num
                    detailCache.updatedAt = new Date()

                    // 캐시 값을 갱신 합니다.
                    this.redis.set(
                        input.detail_id,
                        caches.map(cache => cache.id === input.detail_id ? detailCache : cache),
                        "SchoolService"
                    )
                    
                    // DB의 정보와 캐시 값을 동기화 시키고 Dto를 반환합니다.
                    return await this.repository.updateNewsDetailViews({
                        detail_id: input.detail_id,
                        views: detailCache.now_views,
                        updatedAt: detailCache.updatedAt,
                    })
                    .then(this._newsDetailEntityToDto)
                }

                // 캐시 값을 갱신 하고 Dto를 반환 합니다.
                this.redis.set(
                    "details",
                    caches.map(cache => cache.id === input.detail_id ? detailCache : cache),
                    "SchoolService"
                )
                return {
                    contents: detailCache.contents,
                    views: detailCache.now_views,
                    updatedAt: new Date(detailCache.updatedAt)
                }
            }
        }

        // 캐시 데이터가 존재 하지 않다면 DB에서 조회합니다.
        const detail = await this.repository
        .findNewsDetail({ detail_id: input.detail_id })
        .then(this._newsDetailEntityToDto)

        // 캐시 값을 갱신 하고 Dto를 반환 합니다.
        this.redis.get<NewsDetailCache[] | null>("details", "SchoolService")
        .then((caches) => {
            const data = {
                id: input.detail_id,
                contents: detail.contents,
                now_views: detail.views,
                standard_num: Math.ceil(detail.views % 1000 === 0 ? (detail.views + 1) / 1000 : detail.views / 1000),
                updatedAt: detail.updatedAt,
            } satisfies NewsDetailCache
            if(caches) {
                caches.push(data)
                this.redis.set(
                    "details", 
                    caches, 
                    "SchoolService",
                )
            } else {
                this.redis.set(
                    "details", 
                    [data], 
                    "SchoolService",
                )
            }
        })
        return detail
    }

    public async registerSchool(input: CreateSchoolArgs) : Promise<boolean> {
        return await this.repository.registerSchool(input)
    }

    public async deleteSchool(input: DeleteSchoolArgs) : Promise<boolean> {
        return await this.repository.deleteSchool(input)
    }

    public async registerNews(input: CreateNewsArgs) : Promise<boolean> {
        return await this.repository.registerNews(input)
    }

    public async updateNews(input: UpdateNewsArgs) : Promise<boolean> {
        return await this.repository.updateNews(input)
    }

    public async deleteNews(input: DeleteNewsArgs) : Promise<boolean> {
        return await this.repository.deleteNews(input)
    }

    private _schoolEntityToDto(entity: SchoolEntity) : SchoolDto {
        return {
            name: entity.name,
            region: entity.region,
            news: entity.news.map(this._newsEntityToDto),
        }
    }

    private _newsEntityToDto(entity: NewsEntity) : NewsDto {
        return {
            uuid: entity.uuid,
            title: entity.title,
            detailId: entity.detailId,
            createdAt: entity.createdAt,
        }
    }

    private _newsDetailEntityToDto(entity: NewsDetailEntity) : NewsDetailDto {
        return {
            contents: entity.contents,
            views: entity.views,
            updatedAt: new Date(entity.updatedAt),
        }
    }

    private _killProccess() {
        setTimeout(() => {
            console.log("프로세스가 종료 되었습니다.")
            process.exit()
        }, 10000)
    }
}