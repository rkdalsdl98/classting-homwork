import { tags } from "typia"

export interface SchoolBody {
    register_email: string & tags.Format<"email">
    school_name: string & tags.MaxLength<20>
}
export namespace SchoolBody {
    export interface Create extends SchoolBody {
        school_name: string & tags.MaxLength<20>
        region: string & tags.MaxLength<10>
    }
    export interface Delete extends SchoolBody {}
}

export interface NewsBody {
    register_email: string & tags.Format<"email">
}
export namespace NewsBody {
    export interface Create extends NewsBody {
        school_name: string & tags.MaxLength<20>
        title: string & tags.MaxLength<50>
        contents: string
    }
    export interface Update extends NewsBody {
        newsId: string
        contents?: string
        title?: string & tags.MaxLength<50>
    }
    export interface Delete extends NewsBody {
        newsId: string
    }
}