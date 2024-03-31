import { tags } from "typia"

export interface UserEntity {
    /** 유저 이메일 */
    email: string & tags.Format<"email">

    /** 암호화된 비밀번호 기본 길이 32 + 패리티 1 + 여유 1 */
    pass: string & tags.MaxLength<34>

    /** 비밀번호 검증에 필요한 난수입니다. */
    salt: string & tags.MaxLength<34>

    /**
     * 권한은 외부에서는 직접적으로 수정이 불가하며
     * 
     * 유추할 수 없도록 범위를 따로 지정해두지 않았습니다.
     */
    authority: number

    /**
     * 구독한 학교 배열
     * 
     * 구독한 일자와 이름, 지역을 담고 있으며, 이름은 소식 조회에 사용됩니다.
     */
    subschool: string[]
}