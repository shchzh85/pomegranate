import Router from 'koa-router';

import { Route } from '../common/interfaces';
import userRoutes from './user.routes';
import { response, paramValidate } from '@middlewares/index';

const routes: Route[] = [ ...userRoutes ];

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
