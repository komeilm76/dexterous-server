import { kmApi } from 'km-api';
import z from 'zod';
import { useApiMiddleware } from '@/composables/middleware';
import type { NextFunction, Request, Response } from 'express';
import type { IHttpStatusCode } from 'node_modules/km-api/build/types/lib/api/schemas';

export type IApiSchema = ReturnType<typeof kmApi.apiConfig.makeApiConfig>;

type IErrorType = 'user_not_founded' | 'user_already_exist';
// export type IStepFn<API_SCHEMA extends IApiSchema> = RequestHandler<
//   z.infer<API_SCHEMA["request"]["params"]>,
//   ResponseShape<z.infer<API_SCHEMA["response"]["success"]>, z.infer<API_SCHEMA["response"]["error"]>>,
//   z.infer<API_SCHEMA["request"]["body"]>,
//   z.infer<API_SCHEMA["request"]["query"]>
// >;

export type IApiRequest<API_SCHEMA extends IApiSchema, EXTENDED extends object> = Request<
  Record<keyof z.infer<API_SCHEMA['request']['params']>, string>,
  IResShape<
    z.infer<API_SCHEMA['response'][200]>,
    z.infer<API_SCHEMA['response'][IErrorStatusCodes]>
  >,
  z.infer<API_SCHEMA['request']['body']>,
  Record<keyof z.infer<API_SCHEMA['request']['query']>, string>
> & {
  parsedRequest: {
    body: z.infer<API_SCHEMA['request']['body']>;
    query: z.infer<API_SCHEMA['request']['query']>;
    params: z.infer<API_SCHEMA['request']['params']>;
  };
} & EXTENDED;
export type IApiResponse<API_SCHEMA extends IApiSchema> = Response<
  IResShape<
    z.infer<API_SCHEMA['response'][200]>,
    z.infer<API_SCHEMA['response'][IErrorStatusCodes]>
  >
>;
export type IApiMiddlewareHandler<API_SCHEMA extends IApiSchema> = (
  request: IApiRequest<API_SCHEMA, {}>,
  response: IApiResponse<API_SCHEMA>,
  next: NextFunction
) => void;

export type IMiddlewareHandler = (
  request: Request & {
    parsedRequest: { params: Record<string, any>; query: Record<string, any>; body: any };
  },
  response: Response,
  next: NextFunction
) => void;

type ElementOfArray<T> = T extends readonly (infer U)[] | Array<infer U> ? U : never;

type IErrorStatusCodes =
  | ElementOfArray<typeof kmApi.schemas.clientErrorStatusCodes>
  | `${ElementOfArray<typeof kmApi.schemas.clientErrorStatusCodes>}`
  | ElementOfArray<typeof kmApi.schemas.serverErrorStatusCodes>
  | `${ElementOfArray<typeof kmApi.schemas.serverErrorStatusCodes>}`;

type ISuccessStatusCodes =
  | ElementOfArray<typeof kmApi.schemas.successStatusCodes>
  | `${ElementOfArray<typeof kmApi.schemas.successStatusCodes>}`
  | ElementOfArray<typeof kmApi.schemas.redirectionStatusCodes>
  | `${ElementOfArray<typeof kmApi.schemas.redirectionStatusCodes>}`;

type IErrorShape<CODE extends IErrorStatusCodes, ERROR> = CODE extends 400 | '400'
  ? {
      status: 400;
      error_type: IErrorType;
      message: string;
      data: ERROR;
    }
  : CODE extends 401 | '401'
  ? {
      status: 401;
      message: string;
    }
  : CODE extends 403 | '403'
  ? {
      status: 403;
      message: string;
      data: ERROR;
    }
  : CODE extends 404 | '404'
  ? {
      status: 404;
      message: string;
      data: ERROR;
    }
  : CODE extends 500 | '500'
  ? {
      status: 500;
      message: string;
      data: ERROR;
    }
  : CODE extends 502 | '502'
  ? {
      status: 502;
      message: string;
      data: ERROR;
    }
  : never;

type ISuccessShape<CODE extends ISuccessStatusCodes, SUCCESS> = CODE extends ISuccessStatusCodes
  ? {
      status: ISuccessStatusCodes;
      data: SUCCESS;
    }
  : never;

type IResShape<SUCCESS, ERROR> =
  | ISuccessShape<ISuccessStatusCodes, SUCCESS>
  | IErrorShape<IErrorStatusCodes, ERROR>;

type ResponseShape<SUCCESS, ERROR> =
  | {
      status: 200;
      data: SUCCESS;
    }
  | {
      status: 400;
      error_type: IErrorType;
      message: string;
      data: ERROR;
    }
  | {
      status: 401;
      message: string;
    }
  | {
      status: 403;
      message: string;
      data: ERROR;
    }
  | {
      status: 404;
      message: string;
      data: ERROR;
    }
  | {
      status: 500;
      message: string;
      data: ERROR;
    }
  | {
      status: 502;
      message: string;
      data: ERROR;
    };

export type IRoute<API_SCHEMA extends IApiSchema> = {
  schemas: {
    apiSchema: IApiSchema;
  };
  middlewares: ReturnType<typeof useApiMiddleware<API_SCHEMA>>;
};
