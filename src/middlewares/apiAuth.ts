import { kmApiType } from 'km-api';
import { useLogger } from '../composables/logger';
import { useMiddleware } from '../composables/middleware';
import { useToken } from '../composables/token';

const { log } = useLogger('api-middleware:auth');

const middleware = (status?: kmApiType.schemas.IAuthStatus) => {
  return useMiddleware((req, res, next) => {
    if (status == 'YES') {
      const { make, parse } = useToken();
      const { isExpired, role, valid } = parse(req.headers.authorization);
      if (valid && isExpired == false) {
        if (role == 'admin') {
          next();
        } else {
          next();
        }
      } else {
        const error = log({ message: 'This Api Need Authentication', type: 'error' }, false);
        res.send(error.object);
      }
    } else {
      next();
    }
  });
};
export default { middleware };
