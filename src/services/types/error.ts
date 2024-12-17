export interface ErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export class ApiError extends Error {
  /**
   * HTTP Status code
   */
  private httpStatusCode: number;

  /**
   * Error ID
   */
  private error: string;

  constructor({ message, error, statusCode }: ErrorResponse) {
    super(message);
    this.error = error;
    this.httpStatusCode = statusCode;
  }

  get statusCode(): number {
    return this.httpStatusCode;
  }

  get code(): string {
    return this.error;
  }
}

export const isErrorResponse = (response: any): response is ErrorResponse => {
  return 'message' in response && 'error' in response && 'statusCode' in response;
};

export const throwIfError = (response: any) => {
  if (isErrorResponse(response)) {
    throw new ApiError(response);
  }
};
