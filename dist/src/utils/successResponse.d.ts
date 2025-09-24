export interface SuccessResponse<T = unknown> {
    status: number;
    message: string;
    data: T;
    timestamp: string;
}
export declare const successResponse: <T>(message: string | undefined, data: T) => SuccessResponse<T>;
