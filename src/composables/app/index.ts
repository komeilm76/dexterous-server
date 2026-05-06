import express, { type RequestHandler } from 'express';
import { useLogger } from '../logger';
import { type Express } from 'express';
import { useApis } from '../../apis';
import { useRouter } from '../router';
import { useStore } from '../../stores';
import { useEnvs } from '../env';
import { Subject } from 'rxjs';
import { useMiddlewares } from '../../middlewares';
import { useDB } from '../db';
type IAppConfig = {
  port: number;
};
type IUsableEnvs = Omit<ReturnType<typeof useEnvs>, 'register'>;
type IAppStatus = 'down' | 'on-preload' | 'on-loading' | 'on-loaded';
type IAppStatusFn =
  | { status: 'on-preload' }
  | { status: 'on-loading'; ctx: { envs: IUsableEnvs } }
  | { status: 'on-loaded' };

export const useApp = () => {
  const appEvents = new Subject<IAppStatusFn>();
  const { log } = useLogger('application');

  // launch
  const launch = () => {
    log({ type: 'info', message: `Application In Launch Proccecing...` });
    appEvents.next({ status: 'on-preload' });
  };
  const down = () => {
    log({
      type: 'warn',
      message: 'Application Closed With Valid Desition Proccess',
    });
    process.exit(0);
  };
  // before-start
  const beforeStart = () => {
    const envs = useEnvs();
    const apis = useApis();

    envs.register();
    const { register, ...restEnvs } = envs;

    appEvents.next({ status: 'on-loading', ctx: { envs: restEnvs } });
  };

  const listenToApp = (app: Express, port: number) => {
    return new Promise<void>((rs, rj) => {
      app.listen(port, (error) => {
        log({
          message: (c) =>
            `Application Is Running On: ${c.green(
              `|---> ${c.underline.overline.yellow(`| http://localhost:${port} |`)} <---|`
            )}`,
        });
        if (error) {
          log({ message: 'error on run app', data: error, type: 'error' });
          rj();
        } else {
          rs();
        }
      });
    });
  };

  // start
  const start = async (ctx: { envs: IUsableEnvs }) => {
    const envs = ctx.envs.parsedEnvs();
    const { mongo } = useDB();
    mongo.register(envs.APP_MONGO_DB);
    const store = useStore();
    const middlewares = useMiddlewares();
    const app = express();

    app.use(...(middlewares.bodyParser.middleware() as RequestHandler[]));
    const router = useRouter(store.routeRegisteries);
    router.register();
    app.use(router.router);
    await listenToApp(app, envs.APP_PORT);
    appEvents.next({ status: 'on-loaded' });
  };

  // after-start
  const afterStart = () => {
    log({ type: 'info', message: `Application Loaded and Ready to Use` });
  };

  appEvents.subscribe((event) => {
    log({
      type: 'info',
      message: (c) => `Application In This Proccess:${c.yellow(event.status)}`,
    });
    if (event.status == 'on-preload') {
      beforeStart();
    }
    if (event.status == 'on-loading') {
      start(event.ctx);
    }
    if (event.status == 'on-loaded') {
      afterStart();
    }
  });
  return { launch, down };
};
