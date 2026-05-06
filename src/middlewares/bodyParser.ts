import bodyParser from 'body-parser';
import { useMiddleware } from '../composables/middleware';
const middleware = () => {
  return useMiddleware([
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    bodyParser.raw(),
    bodyParser.text(),
  ]);
};
export default { middleware };
