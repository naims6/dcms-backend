import { TJWTPayload } from ".";


declare global {
  namespace Express {
    interface Request {
      user: TJWTPayload;
    }
  }
}
