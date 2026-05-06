import { kmApiType } from 'km-api';
import { useLogger } from '../composables/logger';
import { useMiddleware } from '../composables/middleware';
import { useToken } from '../composables/token';
import { IApiSchema } from '../types/api';

const { log } = useLogger('api-middleware:auth');

const middleware = (schema: IApiSchema) => {
  return useMiddleware((req, res, next) => {
    if (schema.requestContentType) {
      const isValidContentType = req.is(schema.requestContentType);
      if (typeof isValidContentType == 'string') {
        next();
      } else {
        const error = log(
          { message: `expected Content-type:${schema.requestContentType}`, type: 'error' },
          false
        );
        res.send(error.object);
      }
    } else {
      next();
    }
  });
};
export default { middleware };
