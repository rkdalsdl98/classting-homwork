import { tags } from "typia"

export namespace UserQuery {
    export interface LookUpFeeds {
        email: string & tags.Format<"email">
        desc?: string
    }
}