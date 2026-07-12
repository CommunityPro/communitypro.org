export type Maybe<T> = T | null;

export interface HttpResponse<T> {
  data: T;
  error: string;
  message: string;
  status: number;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: HttpResponse<T>[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
