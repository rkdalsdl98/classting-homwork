import { tags } from "typia"

export interface SchoolEntity {
    /** 
     * 학교 고유 아이디 입니다. 
     * 
     * 주요 정보를 담고있지 않아 조회 시 내부에서 노출 됩니다.
     * */
    uuid: string & tags.MaxLength<32>
    
    /** 학교 페이지 생성 시 지정한 지역 입니다. */
    region: string & tags.MaxLength<10>

    /** 학교의 이름은 20글자로 제한되어 입력 받습니다. */
    name: string & tags.MaxLength<20>

    /** 발행 된 소식들을 담은 배열 입니다. */
    news: NewsEntity[]
}

export interface NewsEntity {
    /** 
     * 뉴스 고유 아이디 입니다. 
     * 
     * 주요 정보를 담고있지 않아 조회 시 내부에서 노출 됩니다.
     * */
    uuid: string & tags.MaxLength<32>

    /** 소식 발행 시 사용 될 제목 입니다. */
    title: string

    /** 
     * 상세정보 고유 아이디 입니다.
     * 
     * 해당 아이디로 조회를 하게 되며 SSR 환경을 위해 Entity를 담지 않고
     * 
     * 아이디를 담아 보냅니다.
     */
    detailId: string & tags.MaxLength<32>

    /** 소식의 발행 일자 입니다. */
    createdAt: Date
}

export interface NewsDetailEntity {
    /** 
     * 뉴스 상세정보 고유 아이디 입니다. 
     * 
     * 주요 정보를 담고있지 않아 조회 시 내부에서 노출 됩니다.
     * */
    uuid: string & tags.MaxLength<32>

    /** 발행 된 소식 정보를 텍스트 형태로 담고 있습니다. */
    contents: string

    /** 조회수를 기록하기 위해 사용 됩니다. */
    views: number

    /** 수정일자를 기록 합니다. */
    updatedAt: Date
}

export interface NewsFeedEntity {
    /** 발행 된 소식의 학교 페이지를 구독한 유저의 이메일 입니다. */
    email: string & tags.Format<"email">

    /** 발행 된 소식의 학교 이름 입니다. */
    school_name: string & tags.MaxLength<20>

    /** 발행 된 소식 입니다. */
    news: NewsEntity
}