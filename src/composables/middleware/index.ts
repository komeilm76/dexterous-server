import { type RequestHandler } from 'express';
import _ from 'lodash';
import { type IApiSchema, type IMiddlewareHandler } from '../../types/api';
import middlewares from '../../middlewares';
import { type IApiMiddlewareHandler } from '../../types/api';

export const useMiddleware = (...steps: (IMiddlewareHandler | IMiddlewareHandler[])[]) => {
  const flatenSteps = _.flatten(steps);
  return flatenSteps;
};

export const useApiMainMiddleware = <API_SCHEMA extends IApiSchema>(
  schemas: API_SCHEMA,
  ...steps: (IApiMiddlewareHandler<API_SCHEMA> | IApiMiddlewareHandler<API_SCHEMA>[])[]
) => {
  const flatenSteps = _.flatten(steps);
  let modifiedSteps: (IMiddlewareHandler | IApiMiddlewareHandler<API_SCHEMA>)[] = [...flatenSteps];
  const { disable, auth } = schemas;
  modifiedSteps = [
    ...middlewares.apiLog.middleware(schemas),
    ...middlewares.apiContentType.middleware(schemas),
    ...middlewares.apiValidRequest.middleware(schemas),
    ...middlewares.apiAuth.middleware(auth),
    ...middlewares.apiDisable.middleware(disable),
    ...flatenSteps,
  ];
  return modifiedSteps;
};

export const useApiMiddleware = <API_SCHEMA extends IApiSchema>(
  ...steps: (IApiMiddlewareHandler<API_SCHEMA> | IApiMiddlewareHandler<API_SCHEMA>[])[]
) => {
  const flatenSteps = _.flatten(steps);
  return flatenSteps;
};
