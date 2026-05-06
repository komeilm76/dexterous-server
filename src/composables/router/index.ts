import { RequestHandler, Router } from 'express';
import { IApiSchema, IMiddlewareHandler, IRoute } from '../../types/api';
import { useLogger } from '../logger';

const router = Router();
export const makeRegistery = () => {
  return [] as IRoute<IApiSchema>[];
};

const { log } = useLogger('router');

export const useRouter = <ROUTE extends IRoute<IApiSchema>>(registery: ROUTE[]) => {
  const addRoute = (route: ROUTE) => {
    registery.push(route);
    return route;
  };
  const registerRoute = (route: ROUTE) => {
    const { method: _method, pathShape } = route.schemas.apiSchema;
    const method = _method.toLocaleLowerCase() as Lowercase<typeof _method>;
    router[method](pathShape, ...(route.middlewares as RequestHandler[]));
  };
  const register = () => {
    registery.forEach((route) => {
      registerRoute(route);
    });
    log({ type: 'info', message: 'Routes Ready to Use' });
  };
  return { router, addRoute, register };
};
