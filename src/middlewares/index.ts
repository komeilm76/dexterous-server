import apiAuth from './apiAuth';
import apiContentType from './apiContentType';
import apiDisable from './apiDisable';
import apiLog from './apiLog';
import apiValidRequest from './apiValidRequest';
import bodyParser from './bodyParser';
export const useMiddlewares = () => {
  return {
    apiAuth,
    apiDisable,
    apiLog,
    apiValidRequest,
    apiContentType,
    bodyParser,
  };
};
export default {
  apiAuth,
  apiDisable,
  apiLog,
  apiValidRequest,
  apiContentType,
  bodyParser,
};
