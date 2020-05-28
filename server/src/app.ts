import Koa from 'koa';
import {
  logger,
  cors,
  body,
  realIp,
  session,
  healthCheck
} from '@middlewares/index';
import router from '@routes/index';

const app = new Koa();

app.keys = ['6fd1de93-812b-4e3a-a4b6-b04d8136a8da'];

app.use(healthCheck());

app.use(logger());

app.use(realIp());

app.use(body());

app.use(cors());

app.use(session(app));

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
