import { tags } from "typia"

export interface UserBody {
    email: string & tags.Format<"email">
}
export namespace UserBody {
    export interface Create extends UserBody {
        pass: string & tags.MaxLength<34>
    }
    export interface Subscribe extends UserBody {
        school_name: string & tags.MaxLength<20>
        region: string & tags.MaxLength<10>
    }
    export interface UnSubscribe extends UserBody {
        school_name: string & tags.MaxLength<20>
    }
    export interface Login extends UserBody {
        pass: string & tags.MaxLength<34>
    }
}