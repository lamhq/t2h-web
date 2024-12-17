export type ServerSideError = {
  statusCode: number;
  message: string;
  redirect?: string;
};

export const isServerSideError = (err: any): err is ServerSideError => {
  return (
    err !== undefined &&
    err.statusCode !== undefined &&
    err.message !== undefined &&
    typeof err.statusCode === 'number' &&
    typeof err.message === 'string'
  );
};
