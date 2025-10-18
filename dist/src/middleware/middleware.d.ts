import type { Request, Response, NextFunction, RequestHandler } from "express";
import { type ZodType } from "zod";
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const validate: <T>(authSchema: ZodType<T>) => RequestHandler;
export declare const errorHandler: (err: any, req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
