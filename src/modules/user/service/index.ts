import { Injectable } from "@nestjs/common";
import UserRepository from "../repository";
import { 
    CreateUserArgs, 
    LoginArgs, 
    LookUpFeedsArgs, 
    SubscribeSchoolArgs, 
    UnSubscribeSchoolArgs 
} from "../repository/type";
import { UserEntity } from "../repository/entity";
import { NewsFeedDto, UserDto } from "./dto";
import { UserSecurity } from "../../../common/auth";
import { NewsFeedEntity } from "../../school/repository/entity";

@Injectable()
export default class UserService {
    constructor(
        private readonly repository: UserRepository
    ){}

    /** 
     * 최초 input으로 받아온 pass는 순수한 입력 값 이지만 한번 가공되어 사용됩니다.
     * @param input
     * @returns 유저 등록 성공 여부를 반환 합니다.
     * */
    public async registerUser(input: Omit<CreateUserArgs, "salt">)
    : Promise<boolean> {
        const { salt, hash } = UserSecurity.encryption(input.pass)
        return await this.repository.registerUser({
            email: input.email,
            pass: hash,
            salt,
        })
    }

    /**
     * 유저가 입력한 정보가 유효한지를 간단히 판단합니다.
     * @param input 
     * @returns 유저 정보를 반환 합니다.
     */
    public async login(input: LoginArgs) : Promise<UserDto | null> {
        return await this.repository.findUnique({ email: input.email })
        .then(entity => {
            const isValid = UserSecurity.verify(input.pass, entity.salt, entity.pass)
            if(isValid) return this._userEntityToDto(entity)
            return null
        })
    }

    public async lookUpFeeds(input: LookUpFeedsArgs) 
    : Promise<NewsFeedDto[]> {
        return await this.repository.lookUpFeeds(input)
        .then(entities => entities.map(this._newsFeedEntityToDto))
    }

    public async subscribeSchool(input: SubscribeSchoolArgs)
    : Promise<boolean> {
        return await this.repository.subscribeSchool({
            email: input.email,
            region: input.region,
            school_name: input.school_name,
        })
    }

    public async unSubscribeSchool(input: UnSubscribeSchoolArgs)
    : Promise<boolean> {
        return await this.repository.unSubscribeSchool({
            email: input.email,
            school_name: input.school_name,
        })
    }

    private _userEntityToDto(entity: UserEntity) : UserDto {
        return {
            email: entity.email,
            authority: entity.authority === 1 ? "student" : "admin",
            subschool: entity.subschool,
        }
    }

    private _newsFeedEntityToDto(entity: NewsFeedEntity) : NewsFeedDto {
        return {
            school_name: entity.school_name,
            news: {
                uuid: entity.news.uuid,
                title: entity.news.title,
                detailId: entity.news.detailId,
                createdAt: entity.news.createdAt,
            }
        }
    }
}