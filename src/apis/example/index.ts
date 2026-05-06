import { useRouter } from '../../composables/router';
import { IRoute } from '../../types/api';
import { useStore } from './../../stores/index';
import middlewares from './middlewares';
import schemas from './schemas';

const { routeRegisteries } = useStore();
const { addRoute } = useRouter<IRoute<typeof schemas.apiSchema>>(routeRegisteries);

export default addRoute({
  schemas,
  middlewares,
});
