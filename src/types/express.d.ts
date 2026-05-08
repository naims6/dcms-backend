import { TJWTPayload } from "../app/modules/auth/auth.types";

declare global {
  namespace Express {
    interface Request {
      user: TJWTPayload;
    }
  }
}
