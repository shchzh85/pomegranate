
import Router from 'koa-router';
import { Route } from '../common/interfaces';
import userRoutes from './user.routes';
import { response, paramValidate } from '@middlewares/index';
import questRoutes from './quest.routes';
import apiRoutes from './api.routes';
import c2cRoutes from './c2c.routes';
import adminRoute from './admin.routes';
import authRoutes from './auth.routes';

const routes: Route[] = [ ...userRoutes, ...questRoutes, ...apiRoutes, ...c2cRoutes, ...authRoutes, ...adminRoute ];

const router = new Router();

routes.forEach(item => {
  const { name, path, method, action, middlewares = [], params: schema, isSkip } = item;
  if (!isSkip) {
    router[method](
      name,
      path,
      ...middlewares,
      paramValidate({ schema }),
      response({ action }),
    );
  }
});

export default router;
