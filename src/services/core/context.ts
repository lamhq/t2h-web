export type ServiceContext = {
  headers: Record<string, any>;
  useProxy: boolean;
  domain: string;
  port: number;
  scheme: 'http' | 'https';
};
