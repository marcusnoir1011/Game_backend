import type { Request, Response, NextFunction } from "express";
import { type ZodType } from "zod";
import { type AuthenticatedRequest } from "../types/authenticatedRequest.js";
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validate: <T>(authSchema: ZodType<T>) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const errorHandler: (err: any, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
