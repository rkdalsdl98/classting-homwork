import { TypedBody, TypedQuery, TypedRoute } from "@nestia/core";
import SchoolService from "../service";

import { Controller } from "@nestjs/common";
import { 
    NewsDetailDto,
    NewsDto, 
    SchoolDto,
} from "../service/dto";
import { FailedResponse, SuccessResponse } from "../../../common/form";
import { NewsQuery } from "./query";
import { NewsBody, SchoolBody } from "./body";

@Controller("school")
export class SchoolController {
    constructor(
        private readonly service: SchoolService
    ){}

    /**
     * 등록 된 학교페이지 목록을 조회하는 API 입니다.
     * @returns 등록 된 학교페이지 목록을 반환합니다.
     * 
     * @tag school public
     */
    @TypedRoute.Get()
    async lookUpSchools() 
    : Promise<SuccessResponse<SchoolDto[]> | FailedResponse> {
        try {
            const result = await this.service.lookUpSchools()
            return {
                data: result,
                status: 200,
            }
        } catch(e) {
            return {
                status: 403,
                message: "Forbidden",
            }
        }
    }

    /**
     * 학교 페이지 생성을 하는 API 입니다.
     * 
     * 권한이 충족되지 않을 경우 실패를 반환합니다.
     * @param {SchoolBody.Register} body 
     * @returns 학교 페이지 생성 결과를 반환합니다.
     * 
     * @tag school private
     */
    @TypedRoute.Post()
    async registerSchool(
        @TypedBody() body: SchoolBody.Create
    ) : Promise<SuccessResponse<boolean> | FailedResponse> {
        try {
            const result = await this.service.registerSchool({
                region: body.region,
                register_email: body.register_email,
                school_name: body.school_name,
            })
            return {
                data: result,
                status: 201,
            }
        } catch(e) {
            return {
                status: 403,
                message: "Forbidden",
            }
        }
    }

    /**
     * 학교 페이지 삭제하는 API 입니다.
     * 
     * 권한이 충족되지 않을 경우 실패를 반환합니다.
     * @param {SchoolBody.Delete} body 
     * @returns 학교 페이지 삭제 결과를 반환합니다.
     * 
     * @tag school private
     */
    @TypedRoute.Delete()
    async deleteSchool(
        @TypedBody() body: SchoolBody.Delete
    ) : Promise<SuccessResponse<boolean> | FailedResponse> {
        try {
            const result = await this.service.deleteSchool({
                register_email: body.register_email,
                school_name: body.school_name,
            })
            return {
                data: result,
                status: 200,
            }
        } catch(e) {
            return {
                status: 403,
                message: "Forbidden",
            }
        }
    }

    /**
     * 발행 된 학교 소식목록을 조회하는 API 입니다.
     * @param {NewsQuery.LookUp} query
     * @returns 발행 된 소식목록을 불러 옵니다.
     * 
     * @tag school public
     */
    @TypedRoute.Get("news")
    async lookUpNews(
        @TypedQuery() query: NewsQuery.LookUp
    ) : Promise<SuccessResponse<NewsDto[]> | FailedResponse> {
        try {
            const result = await this.service.lookUpNews({
                desc: query.desc === "desc" ? true : false,
                school_name: query.school_name,
            })
            return {
                data: result,
                status: 200,
            }
        } catch(e) {
            return {
                status: 403,
                message: "Forbidden",
            }
        }
    }
    
    /**
     * 학교 페이지 소식의 상세정보를 찾는 API 입니다.
     * @param {NewsQuery.FindDetail} query 
     * @returns 소식의 상세정보를 찾아 반환합니다.
     * 
     * @tag school public
     */
    @TypedRoute.Get("news/detail")
    async findDetail(
        @TypedQuery() query: NewsQuery.FindDetail
    ) : Promise<SuccessResponse<NewsDetailDto> | FailedResponse> {
        try {
            const result = await this.service.findNewsDetail({
                detail_id: query.detailId
            })
            return {
                data: result,
                status: 200,
            }
        } catch(e) {
            return {
                status: 204,
                message: "NotFoundData",
            }
        }
    }

    /**
     * 학교 페이지 소식을 발행하는 API 입니다.
     * 
     * 권한이 충족되지 않을 경우 실패를 반환합니다.
     * @param {NewsBody.Create} body 
     * @returns 학교 소식 발행 결과를 반환합니다.
     * 
     * @tag school private
     */
    @TypedRoute.Post("news")
    async registerNews(
        @TypedBody() body: NewsBody.Create
    ) : Promise<SuccessResponse<boolean> | FailedResponse> {
        try {
            const result = await this.service.registerNews({
                contents: body.contents,
                register_email: body.register_email,
                school_name: body.school_name,
                title: body.title,
            })
            return {
                data: result,
                status: 201,
            }
        } catch(e) {
            return {
                status: 204,
                message: "NotFoundData",
            }
        }
    }

    /**
     * 학교 페이지 소식을 갱신, 업데이트하는 API 입니다.
     * 
     * 권한이 충족되지 않을 경우 실패를 반환합니다.
     * @param {NewsBody.Update} body 
     * @returns 학교 소식 갱신 결과를 반환합니다.
     * 
     * @tag school private
     */
    @TypedRoute.Patch("news")
    async updateNews(
        @TypedBody() body: NewsBody.Update
    ) : Promise<SuccessResponse<boolean> | FailedResponse> {
        try {
            const result = await this.service.updateNews({
                newsId: body.newsId,
                register_email: body.register_email,
                contents: body.contents,
                title: body.title,
            })
            return {
                data: result,
                status: 200,
            }
        } catch(e) {
            return {
                status: 204,
                message: "NotFoundData",
            }
        }
    }

    /**
     * 학교 페이지 소식을 삭제하는 API 입니다.
     * 
     * 권한이 충족되지 않을 경우 실패를 반환합니다.
     * @param {NewsBody.Delete} body 
     * @returns 학교 소식 삭제 결과를 반환합니다.
     * 
     * @tag school private
     */
    @TypedRoute.Delete("news")
    async deleteNews(
        @TypedBody() body: NewsBody.Delete
    ) : Promise<SuccessResponse<boolean> | FailedResponse> {
        try {
            const result = await this.service.deleteNews({
                newsId: body.newsId,
                register_email: body.register_email,
            })
            return {
                data: result,
                status: 200,
            }
        } catch(e) {
            return {
                status: 204,
                message: "NotFoundData",
            }
        }
    }
}