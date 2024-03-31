import UserService from "../service";
import { UserBody } from "./body";
import { FailedResponse, SuccessResponse } from "../../../common/form";
import { NewsFeedDto, UserDto } from "../service/dto";

import { Controller } from "@nestjs/common";
import { TypedBody, TypedQuery, TypedRoute } from "@nestia/core";
import { UserQuery } from "./query";

@Controller("user")
export class UserController {
    constructor(
        private readonly service: UserService
    ){}
    
    /**
     * 뉴스피드 조회를 위한 API 입니다.
     * @param {UserBody.LookUpFeeds} body 
     * @returns 내 뉴스피드를 조회 합니다.
     * 
     * @tag user private
     */
    @TypedRoute.Get("feeds")
    async lookUpFeeds(
        @TypedQuery() query: UserQuery.LookUpFeeds
    ) : Promise<SuccessResponse<NewsFeedDto[]> | FailedResponse> {
        try {
            const result = await this.service.lookUpFeeds({
                email: query.email,
                desc: query.desc === "desc" ? true : false,
            })
            return {
                data: result,
                status: 200,
            }
        } catch(e) {
            return {
                status: 403,
                message: "Forbidden"
            }
        }
    }

    /**
     * 유저 등록을 위한 API 입니다.
     * 
     * 권한 설정은 불가합니다.
     * @param {UserBody.Create} body 
     * @returns 유저 등록 결과를 반환합니다.
     * 
     * @tag user public
     */
    @TypedRoute.Post()
    async registerUser(
        @TypedBody() body: UserBody.Create
    ) : Promise<SuccessResponse<boolean> | FailedResponse> {
        try {
            const result = await this.service.registerUser({
                email: body.email,
                pass: body.pass,
            })
            return {
                data: result,
                status: 201,
            }
        } catch(e) {
            return {
                status: 403,
                message: "Forbidden"
            }
        }
    }

    /**
     * 유저 로그인 API 입니다.
     * @param {UserBody.Login} body 
     * @returns 성공 시 유저 정보를 반환합니다.
     * 
     * @tag user private
     */
    @TypedRoute.Post("login")
    async loginUser(
        @TypedBody() body: UserBody.Login
    ) : Promise<SuccessResponse<UserDto | null> | FailedResponse> {
        try {
            const result = await this.service.login({
                email: body.email,
                pass: body.pass,
            })
            return result 
            ? {
                data: result,
                status: 201
            }
            : {
                data: null,
                status: 204,
            }
        } catch(e) {
            return {
                status: 204,
                message: "NotFoundData"
            }
        }
    }

    /**
     * 학교 페이지를 구독하는 API 입니다.
     * @param {UserBody.Subscribe} body 
     * @returns 학교 페이지 구독 결과를 반환합니다.
     * 
     * @tag user private
     */
    @TypedRoute.Patch("subscribe")
    async subscribeSchool(
        @TypedBody() body: UserBody.Subscribe
    ) : Promise<SuccessResponse<boolean> | FailedResponse> {
        try {
            const result = await this.service.subscribeSchool({
                email: body.email,
                region: body.region,
                school_name: body.school_name,
            })
            return {
                data: result,
                status: 200,
            }
        } catch(e) {
            return {
                status: 403,
                message: "Forbidden"
            }
        }
    }

    /**
     * 구독 한 학교 페이지를 삭제하는 API 입니다.
     * @param {UserBody.UnSubscribe} body 
     * @returns 학교 페이지 구독 취소 결과를 반환합니다.
     * 
     * @tag user private
     */
    @TypedRoute.Patch("unsubscribe")
    async unSubscribeSchool(
        @TypedBody() body: UserBody.UnSubscribe
    ) : Promise<SuccessResponse<boolean> | FailedResponse> {
        try {
            const result = await this.service.unSubscribeSchool({
                email: body.email,
                school_name: body.school_name
            })
            return {
                data: result,
                status: 200,
            }
        } catch(e) {
            return {
                status: 403,
                message: "Forbidden"
            }
        }
    }
}