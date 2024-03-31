import { UserSecurity } from "../../common/auth"
import UserRepository from "./repository"
import { UserEntity } from "./repository/entity"
import UserService from "./service"

import { Test, TestingModule } from "@nestjs/testing"
import { UserProvider } from "./repository/provider"
import { nanoid } from "nanoid"
import { UserDto } from "./service/dto"
import { NewsDetailEntity, NewsEntity, SchoolEntity } from "../school/repository/entity"
import SchoolService from "../school/service"
import SchoolRepository from "../school/repository"
import RedisService from "../redis/service"
import RedisModule from "../redis"
import { NewsProvider } from "../school/repository/provider"

describe("user", () => {
    let service: UserService
    let repository: UserRepository
    let school_service: SchoolService
    let school_repository: SchoolRepository
    let redis: RedisService

    let user_database: UserEntity[] = []
    let school_database: SchoolEntity[] = []
    let student: UserDto | null = null

    let details: NewsDetailEntity[] = [
        {
            uuid: nanoid(32),
            contents: "새로운 소식1",
            views: 1,
            updatedAt: new Date()
        },
        {
            uuid: nanoid(32),
            contents: "새로운 소식2",
            views: 1,
            updatedAt: new Date()
        },
        {
            uuid: nanoid(32),
            contents: "새로운 소식3",
            views: 1,
            updatedAt: new Date()
        },
    ]

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [RedisModule],
          providers: [
            UserRepository,
            UserService,
            SchoolService,
            SchoolRepository,
          ],
        })
        .compile()
        
        redis = module.get<RedisService>(RedisService)
        service = module.get<UserService>(UserService)
        repository = module.get<UserRepository>(UserRepository)
        school_service = module.get<SchoolService>(SchoolService)
        school_repository = module.get<SchoolRepository>(SchoolRepository)

        school_database.push({
            name: "효성서초등학교",
            region: "인천",
            news: [
                {
                    uuid: nanoid(32),
                    title: "소식1",
                    detailId: details[0].uuid,
                    createdAt: new Date()
                },
                {
                    uuid: nanoid(32),
                    title: "소식4",
                    detailId: details[0].uuid,
                    createdAt: new Date()
                }
            ],
            uuid: nanoid(32),
        })
        school_database.push({
            name: "효성남초등학교",
            region: "인천",
            news: [
                {
                    uuid: nanoid(32),
                    title: "소식2",
                    detailId: details[1].uuid,
                    createdAt: new Date()
                }
            ],
            uuid: nanoid(32),
        })
        school_database.push({
            name: "효성동초등학교",
            region: "인천",
            news: [
                {
                    uuid: nanoid(32),
                    title: "소식3",
                    detailId: details[2].uuid,
                    createdAt: new Date()
                }
            ],
            uuid: nanoid(32),
        })
    })

    it("Should be defined", () => {
        expect(service).toBeDefined()
        expect(repository).toBeDefined()
    })
    

    describe("/ (Post)", () => {
        it.todo("학생 등록을 할 수 있다.")

        it("학생 (회원가입)", async () => {
            jest.spyOn(repository, "registerUser").mockImplementation(async (args) => {
                const { salt, hash } = UserSecurity.encryption(args.pass)

                try {
                    user_database.push(UserProvider.Entity.toJson({
                        email: args.email,
                        pass: hash,
                        salt,
                        authority: 1,
                        uuid: nanoid(32),
                        subschool: [],
                    }))
                    return true
                } catch(e) { return false }
            })

            const result = await service.registerUser({
                email: "tester@test.com",
                pass: "test",
            })

            expect(result).toEqual(true)
            expect(user_database).toHaveLength(1)
        })

        it("학생 (로그인)", async () => {
            const findUnique = jest.fn()
            findUnique.mockImplementation(email => user_database.find(entity => entity.email === email))

            jest.spyOn(service, "login").mockImplementation(async (args) => {
                let comparedEntity: UserEntity | undefined = findUnique(args.email)
                const { salt, hash } = UserSecurity.encryption(args.pass)
   
                if(comparedEntity
                && UserSecurity.verify(
                    args.pass, 
                    salt, 
                    hash,
                )) {
                    try {
                        return {
                            authority: comparedEntity.authority === 1 ? "student" : "admin",
                            email: comparedEntity.email,
                            subschool: comparedEntity.subschool,
                        }
                    } catch(e) { return null }
                }
                return null
            })

            student = await service.login({
                email: "tester@test.com",
                pass: "test"
            })

            expect(student).not.toBeNull()
        })
    })

    describe("/ (Patch)", () => {
        it.todo("학생은 학교 페이지를 구독할 수 있다.")

        it("학교 페이지 구독", async () => {
            jest.spyOn(repository, "subscribeSchool").mockImplementation(async (args) => {
                if(student) {
                    const isAlreadySubscribe = !!(student.subschool.find(school => school === args.school_name))
                    if(!isAlreadySubscribe) {
                        student.subschool.push(args.school_name)
                        return true
                    }
                }
                return false
            })

            await service.subscribeSchool({
                email: student!.email,
                region: "인천",
                school_name: "효성서초등학교"
            })

            await service.subscribeSchool({
                email: student!.email,
                region: "인천",
                school_name: "효성남초등학교"
            })

            expect(student!.subschool).toHaveLength(2)
        })
    })

    describe("/ (Get)", () => {
        it.todo("학생은 구독 중인 학교 페이지 목록을 확인할 수 있다.")

        it("구독중인 학교 페이지 조회", () => {
            const lookUpSubscribeSchool = jest.fn()
            lookUpSubscribeSchool.mockReturnValue(student!.subschool)

            const subschool = lookUpSubscribeSchool()

            expect(subschool).toBeDefined()
            expect(subschool).toHaveLength(2)
        })

        it.todo("학생은 구독 중인 학교 페이지별 소식을 볼 수 있다.")

        it("구독중인 학교 페이지별 소식 조회", async () => {
            jest.spyOn(school_repository, "lookUpNews").mockImplementation(async (args) => {
                const news : NewsEntity[] = []
                for(let i=0; i<school_database.length; ++i) {
                    if(args.school_name && school_database[i].name === args.school_name) {
                        news.push(...school_database[i].news
                        .map(n => {
                            return NewsProvider.Entity.toJson({
                                uuid: n.uuid,
                                detail: { uuid: n.detailId },
                                title: n.title,
                                schoolId: "random str",
                                createdAt: n.createdAt,
                            })
                        })
                        .sort((a,b) => {
                            if(a.createdAt > b.createdAt) return args.desc ? -1 : 1
                            else if(a.createdAt < b.createdAt) return args.desc ? 1 : -1
                            return 0
                        }))
                        break
                    }
                }
                return news
            })

            const result = await school_service.lookUpNews({
                desc: true,
                school_name: "효성남초등학교"
            })

            expect(result).toBeDefined()
            expect(result).toHaveLength(1)
        })
    })

    describe("/ (Patch)", () => {
        it.todo("학생은 구독 중인 학교 페이지를 구독 취소할 수 있다.")

        it("학교 페이지 구독 취소", async () => {
            jest.spyOn(repository, "unSubscribeSchool").mockImplementation(async (args) => {
                if(student) {
                    student.subschool = student.subschool.filter(school => school !== args.school_name)
                    return true
                }
                return false
            })

            const result = await service.unSubscribeSchool({
                email: "tester@test.com",
                school_name: "효성서초등학교"
            })

            expect(result).toEqual(true)
            expect(student?.subschool).toHaveLength(1)
        })
    })
})