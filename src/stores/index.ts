import { IApiSchema, IRoute } from '../types/api';

const routeRegisteries: IRoute<IApiSchema>[] = [];

export const useStore = () => {
  return { routeRegisteries };
};
