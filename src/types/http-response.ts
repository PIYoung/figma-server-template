export interface BaseResponse<T = any> {
  result: boolean;
  message: string;
  data?: T | T[];
}

export interface BasicResponse<T = any> extends BaseResponse<T> {
  data: T;
}

export interface ListResponse<T = any> extends BaseResponse<T> {
  count: number;
  data: T[];
}

export interface HttpError {
  status: number;
  path: string;
  method: string;
  request: {
    headers: any;
    query: any;
    params: any;
    body: any;
  };
}

export interface ErrorResponse extends BaseResponse<HttpError> {
  result: false;
}
