import UserService from '../user/service';
import RedisModule from '../redis';
import RedisService from '../redis/service';
import SchoolRepository from './repository';
import SchoolService from './service';
import { Test, TestingModule } from '@nestjs/testing';
import { 
    SchoolProvider,
    NewsProvider,
    NewsDetailProvider, 
} from './repository/provider';
import UserRepository from '../user/repository';
import { NewsDetailEntity, NewsEntity, SchoolEntity } from './repository/entity';
import { nanoid } from 'nanoid';

describe("school", () => {
    let service: SchoolService
    let user_service: UserService
    let repository: SchoolRepository
    let user_repository: UserRepository
    let redis: RedisService
    let authCondition: boolean

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        imports: [RedisModule],
          providers: [
            SchoolService,
            SchoolRepository,
            UserRepository,
            UserService,
          ],
        })
        .compile()
        
        user_service = module.get<UserService>(UserService)
        service = module.get<SchoolService>(SchoolService)
        user_repository = module.get<UserRepository>(UserRepository)
        repository = module.get<SchoolRepository>(SchoolRepository)
        redis = module.get<RedisService>(RedisService)

        /** 
         * 학교 페이지 등록에 필요한 권한을 가지고 있는지 체크 합니다.
         * 
         * 실제 사용되는 권한 여부 체크 루틴과 동일합니다. 
         * */
        authCondition = await user_service.login({
            email: admin_email,
            pass: admin_pass,
        })
        .then(user => {
            if(user && user.authority === "admin") return true
            return false
        })
    })

    
    it("Should be defined and check auth condition", () => {
        expect(redis).toBeDefined()
        expect(repository).toBeDefined()
        expect(service).toBeDefined()
        expect(user_service).toBeDefined()

        expect(authCondition).toEqual(true)
    })

    const admin_email = "admin@admin.com"
    const admin_pass = "admin"

    let school: SchoolEntity | null = null
    let news: NewsEntity | null = null
    let news_detail: NewsDetailEntity | null = null
    
    describe("/ (Post)", () => {
        it.todo("학교 관리자는 지역, 학교명으로 학교 페이지를 생성할 수 있다.")

        /**
         * 1. 권한이 존재해야 한다.
         * 2. 입력값과 학교 페이지의 프로퍼티 타입이 호환되어야 한다.
         * 3. 생성 된 학교 페이지가 존재해야 한다.
         */
        it("학교 페이지 등록", async () => {
            jest.spyOn(repository, "registerSchool").mockImplementation(async (args) => {
                if(authCondition) {
                    try {
                        /** 
                         * 권한을 충족한다면 미리 작성해둔 toJson 함수로 객체 타입을 체크하며 생성하고
                         * 
                         * 오류를 반환 하지 않는다면 성공을 리턴합니다.
                         */
                        school = SchoolProvider.Entity.toJson({
                            name: args.school_name,
                            region: args.region,
                            uuid: nanoid(32),
                            news: [],
                        })
                        return true
                    } catch(e) { return false }
                }
                return false
            })
            const result = await service.registerSchool({
                register_email: admin_email,
                region: "인천",
                school_name: "서초등학교"
            })
            expect(result).toEqual(true)
            expect(school).not.toBeNull()
        })

        it.todo("학교 관리자는 학교 페이지 내에 소식을 작성할 수 있다.")

        /**
         * 1. 권한이 존재해야 한다.
         * 2. 입력값과 소식과 소식 상세의 프로퍼티 타입이 호환되어야 한다.
         * 3. 생성 된 소식과 소식의 상세가 존재해야 한다..
         */
        it("학교 페이지 소식 발행", async () => {
            jest.spyOn(repository, "registerNews").mockImplementation(async (args) => {
                if(authCondition) {
                    try {
                        let newsId = nanoid(32)
                        /** 
                         * 권한을 충족한다면 미리 작성해둔 toJson 함수로 객체 타입을 체크하며 생성하고
                         * 
                         * 오류를 반환 하지 않는다면 성공을 리턴합니다.
                         */
                        news_detail = NewsDetailProvider.Entity.toJson({
                            uuid: nanoid(32),
                            contents: args.contents,
                            newsId,
                            views: 1,
                            updatedAt: new Date()
                        })
                        news = NewsProvider.Entity.toJson({
                            title: args.title,
                            uuid: newsId,
                            schoolId: school!.uuid,
                            detail: { uuid: news_detail.uuid },
                            createdAt: new Date()
                        })
                        return true
                    } catch(e) { return false }
                }
                return false
            })

            if(school) {
                const result = await service.registerNews({
                    contents: "테스트",
                    register_email: admin_email,
                    school_name: school.name,
                    title: "테스트",
                })
                expect(result).toEqual(true)
                expect(news).not.toBeNull()
                expect(news_detail).not.toBeNull()
            } else return false
        })
    })
    
    describe("/ (Patch)", () => {
        it.todo("학교 관리자는 작성된 소식을 수정할 수 있다.")

        /**
         * 1. 권한과 갱신 하려는 소식이 존재해야 한다.
         * 2. 변경하려는 소식과 소식 상세의 프로퍼티가 바뀌거나 바뀌지 않아야 한다.
         * 3. 입력값이 변경하려는 프로퍼티의 타입과 호환 되어야 한다.
         */
        it("학교 페이지 소식 갱신", async () => {
            jest.spyOn(repository, "updateNews").mockImplementation(async (args) => {
                if(authCondition) {
                    try {
                        /** 
                         * 권한을 충족한다면 변경사항을 저장하고 예외를 반환 하지 않는다면 성공을 리턴합니다.
                         */
                        if(args.newsId === news!.uuid && news!.detailId === news_detail!.uuid) {
                            news_detail!.contents = args.contents ?? news_detail!.contents
                            news!.title = args.title ?? news!.title
                            return true
                        }
                        return false
                    } catch(e) { return false }
                }
                return false
            })

            if(news && news_detail) {
                const result = await service.updateNews({
                    contents: "테스트 2",
                    newsId: news.uuid,
                    register_email: admin_email,
                })
    
                expect(result).toEqual(true)
                expect(news.title).toEqual(news.title)
                expect(news_detail.contents).toEqual("테스트 2")
            } else return false
        })
    })

    describe("/ (Delete)", () => {
        it.todo("학교 관리자는 작성된 소식을 삭제할 수 있다.")

        /**
         * 1. 권한과 삭제 하려는 소식이 존재해야 한다.
         * 2. 소식과 소식 상세가 null 이어야 한다.
         */
        it("학교 페이지 소식 삭제", async () => {
            jest.spyOn(repository, "deleteNews").mockImplementation(async (args) => {
                if(authCondition) {
                    try {
                        /** 
                         * 권한을 충족한다면 삭제 하려는 소식이 있는지 판별하고
                         * 
                         * 존재 한다면 해당 소식을 null로 전환 합니다.
                         */
                        if(args.newsId === news!.uuid) {
                            news = null
                            news_detail = null
                            return true
                        }
                        return false
                    } catch(e) { return false }
                }
                return false
            })

            if(news && news_detail) {
                const result = await service.deleteNews({
                    newsId: news.uuid,
                    register_email: admin_email,
                })

                expect(result).toEqual(true)
                expect(news).toBeNull()
                expect(news_detail).toBeNull()
            } else return false
        })
    })
})