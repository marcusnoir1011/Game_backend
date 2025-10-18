import type { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface UserPayLoad extends JwtPayload {
            id: number;
        }
        interface Request {
            user?: UserPayLoad;
        }
    }
}
