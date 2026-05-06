import { useApiMainMiddleware, useApiMiddleware } from './../../../../composables/middleware/index';
import schemas from '../schemas';
import { v4, v6 } from 'uuid';
const middleware = useApiMainMiddleware(
  schemas.apiSchema,
  useApiMiddleware<typeof schemas.apiSchema>((req, res, next) => {
    console.log('parsed', req.parsedRequest.params.id.value);

    res.status(200).send({ status: 200, data: { counter: 1 } });
  }, [])
);
export default middleware;
