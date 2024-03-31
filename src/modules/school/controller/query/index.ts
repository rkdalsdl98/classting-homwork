import { tags } from "typia"

export namespace NewsQuery {
    export interface LookUp {
        desc?: string
        school_name?: string & tags.MaxLength<20>
    }
    export interface FindDetail {
        detailId: string
    }
}