import { tags } from "typia"

export type CreateUserArgs = {
    email: string & tags.Format<"email">
    /** 로그인에서 필요한 pass와는 다른 암호화 된 값입니다. */
    pass: string & tags.MaxLength<34>
    salt: string & tags.MaxLength<34>
}

export type SubscribeSchoolArgs = {
    email: string & tags.Format<"email">
    school_name: string & tags.MaxLength<20>
    region: string & tags.MaxLength<10>
}

export type UnSubscribeSchoolArgs = Omit<SubscribeSchoolArgs, "region">

export type LoginArgs = {
    email: string & tags.Format<"email">
    /** 생성에서 필요한 pass와는 다른 사용자가 입력한 순수한 값입니다. */
    pass: string & tags.MaxLength<34>
}

export type LookUpFeedsArgs = {
    desc: boolean
    email: string & tags.Format<"email">
}