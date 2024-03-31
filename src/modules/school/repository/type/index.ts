import { tags } from "typia"

export type CreateSchoolArgs = {
    register_email: string & tags.Format<"email">
    school_name: string & tags.MaxLength<20>
    region: string & tags.MaxLength<10>
}

export type DeleteSchoolArgs = Omit<CreateSchoolArgs, "region">

export type CreateNewsArgs = {
    register_email: string & tags.Format<"email">
    school_name: string & tags.MaxLength<20>
    title: string & tags.MaxLength<50>
    contents: string
}

type InternalUpdateNewsArgs = Partial<Pick<CreateNewsArgs, "title" | "contents">> & { register_email: string & tags.Format<"email">, newsId: string }
export type UpdateNewsArgs = { [key in keyof InternalUpdateNewsArgs]: InternalUpdateNewsArgs[key]}

type InternalDeleteNewsArgs = Pick<CreateNewsArgs, "register_email"> & { newsId: string }
export type DeleteNewsArgs = { [key in keyof InternalDeleteNewsArgs]: InternalDeleteNewsArgs[key] }

export type LookUpNewsArgs = {
    desc: boolean
    school_name?: string & tags.MaxLength<20>
}

export type UpdateNewsDetailViews = {
    detail_id: string
    views: number
    updatedAt: Date
}

export type FindNewsDetailArgs = {
    detail_id: string
}