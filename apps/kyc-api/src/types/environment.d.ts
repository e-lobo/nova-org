declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production' | 'test';
      PORT?: string;
      API_URL?: string;
      DATABASE_URL?: string;
      LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
    }
  }
}

export {};
