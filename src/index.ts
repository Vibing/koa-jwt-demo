import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import * as koaJwt from 'koa-jwt';
import * as jwt from 'jsonwebtoken';
import AppRoutes from './routes';
import secret from './config/secret';

const getToken = (payload = {}) =>
  jwt.sign(payload, 'my_app_secret', { expiresIn: '1h' });

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3000;

createConnection()
  .then(async connection => {
    // token验证错误时的处理，如过期、token错误
    app.use((ctx, next) => {
      if (ctx.header && ctx.header.authorization) {
        const parts = ctx.header.authorization.split(' ');
        if (parts.length === 2) {
          const scheme = parts[0];
          const token = parts[1];

          if (/^Bearer$/i.test(scheme)) {
            //根据token解析出用户信息
            const user = jwt.decode(token, { complete: true });
            try {
              //验证token是否有效
              jwt.verify(token, secret.sign, {
                complete: true
              });
              ctx.state.user = user;
            } catch (error) {
              //token过期 生成新的token
              const newToken = getToken(user);
              ctx.res.setHeader('Authorization', newToken);
            }
          }
        }
      }

      return next().catch(err => {
        if (err.status === 401) {
          ctx.status = 401;
          ctx.body =
            'Protected resource, use Authorization header to get access\n';
        } else {
          throw err;
        }
      });
    });

    //路由权限控制 除了path里的路径不需要验证token 其他都要
    app.use(
      koaJwt({
        secret: secret.sign
      }).unless({
        path: [/^\/login/, /^\/register/]
      })
    );

    //路由
    AppRoutes.forEach(route => router[route.method](route.path, route.action));

    app.use(bodyParser());
    app.use(router.routes());
    app.use(router.allowedMethods());

    app.listen(port);
  })
  .catch(error => console.log(error));
