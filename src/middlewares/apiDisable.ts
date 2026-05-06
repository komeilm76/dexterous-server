import { kmApiType } from 'km-api';
import { useLogger } from '../composables/logger';
import { useMiddleware } from '../composables/middleware';

const { log } = useLogger('api-middleware:disable');

const middleware = (status?: kmApiType.schemas.IDisableStatus) => {
  return useMiddleware((req, res, next) => {
    if (status == 'YES') {
      const error = log({ message: 'This Api Exist But Disabled', type: 'error' }, false);
      res.send(error.object);
    } else {
      next();
    }
  });
};
export default { middleware };
