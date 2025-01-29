import { User } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      id: string;
      user?: User;
    }
  }
}
