export type ApiErrorDetail = {
  field?: string;
  message: string;
};

export type ApiErrorBody = {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: ApiErrorDetail[];

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.status = status;
    this.code = body.code;
    this.details = body.details ?? [];
  }
}
