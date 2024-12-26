export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
  }
  
  export interface ITokens {
    accessToken: string;
    refreshToken: string;
  }
  
  export interface IPagination {
    current: number;
    total: number;
    count: number;
  }
  
  export class AppError extends Error {
    constructor(
      public message: string,
      public statusCode: number,
      public isOperational = true
    ) {
      super(message);
      Object.setPrototypeOf(this, AppError.prototype);
    }
  }