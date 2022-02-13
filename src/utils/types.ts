export interface IResponse<T> {
    error: boolean
    statusCode: number
    message?: any
    data?: T
    errors?: any
    total?: number
}
