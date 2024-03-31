import { NewsDto } from "../../../school/service/dto"
import { tags } from "typia"

export interface UserDto {
    email: string & tags.Format<"email">
    authority: Authority
    subschool: string[]
}

export interface NewsFeedDto {
    school_name: string & tags.MaxLength<20>
    news: NewsDto
}

type Authority = "student" | "admin"