import chalk, { ChalkInstance } from 'chalk';
import { kmApiType } from 'km-api';
import { useLogger } from '../composables/logger';
import { IApiSchema } from '../types/api';
import { useMiddleware } from '../composables/middleware';

const { log } = useLogger('api-middleware:log');

const middleware = (apiSchema: IApiSchema) => {
  const authIcon = (status: kmApiType.schemas.IAuthStatus | undefined) => {
    return status == 'YES' ? '🔒' : '🔓';
  };
  const disableIcon = (status: kmApiType.schemas.IDisableStatus | undefined) => {
    return status == 'YES' ? '🔴' : '🟢';
  };
  const showMethod = (ctx: ChalkInstance, method: kmApiType.schemas.IMethod) => {
    const _method = method.toLocaleLowerCase() as Lowercase<typeof method>;
    if (_method == 'get') {
      return ctx.blue(method);
    } else if (_method == 'post') {
      return ctx.green(method);
    } else if (_method == 'put') {
      return ctx.yellow(method);
    } else if (_method == 'delete') {
      return ctx.red(method);
    } else if (_method == 'options') {
      return ctx.cyan(method);
    } else if (_method == 'patch') {
      return ctx.gray(method);
    } else if (_method == 'head') {
      return ctx.white(method);
    }
  };
  return useMiddleware((req, res, next) => {
    const { method, pathShape, auth, disable } = apiSchema;
    log({
      message: (c) => {
        return [
          `\n\t${c.bold('----------------------')}`,
          `${c.bold('🌐 CALLED API INFO 🌐')}`,
          `CONTENT-TYPE  :\t${c.dim(JSON.stringify(req.headers['content-type']))}`,
          `METHOD:\t ${showMethod(c, method.toUpperCase() as Uppercase<typeof method>)}`,
          `AUTH  :\t${authIcon(auth)}`,
          `ACTIVE:\t${disableIcon(disable)}`,
          `PATH  :\t${c.magenta(pathShape)}`,
          `URL   :\t${c.dim.underline(req.url)}`,
          `QUERY :\t${c.dim(JSON.stringify(req.query))}`,
          `PARAMS:\t${c.dim(JSON.stringify(req.params))}`,
          ...((method as Lowercase<typeof method>) == 'get'
            ? []
            : [`BODY  :\t${c.dim(JSON.stringify(req.body))}`]),
          `${c.bold('----------------------')}`,
        ].join('\n\t');
      },
      // `ACTIVE:${disableIcon(disable)} | [${showMethod(c, method)}] ${c.magenta(pathShape)}`,
      // ` PATH:${c.magenta(pathShape)}\n\t${c.dim("PARAMS")}: ${c.dim(JSON.stringify(req.params))} | QUERY: ${c.dim(JSON.stringify(req.query))} | URL: ${c.dim.underline(req.url)}
      // `,
      type: 'info',
    });
    next();
  });
};
export default { middleware };
