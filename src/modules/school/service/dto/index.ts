import { tags } from "typia"

export interface SchoolDto {
    region: string & tags.MaxLength<10>
    name: string & tags.MaxLength<20>
}

export interface NewsDto {
    uuid: string & tags.MaxLength<32>
    title: string
    detailId: string & tags.MaxLength<32>
    createdAt: Date
}

export interface NewsDetailDto {
    contents: string
    views: number
    updatedAt: Date
}