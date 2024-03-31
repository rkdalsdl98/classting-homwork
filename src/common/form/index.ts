export interface SuccessResponse<T> {
    data: T
    status: number
}

export interface FailedResponse {
    status: number
    message: string
}