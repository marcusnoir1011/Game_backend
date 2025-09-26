import type { Request, Response, NextFunction } from "express";
import { type ZodType } from "zod";
export interface CustomRequest extends Request {
    user?: {
        id: number;
    };
}
export declare const authenticate: (req: CustomRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validate: <T>(authSchema: ZodType<T>) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const errorHandler: (err: any, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
