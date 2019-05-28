import * as jwt from 'jsonwebtoken';
import * as util from 'util';
import secret from '../config/secret';

const verify = util.promisify(jwt.verify);

export default () => {
  return async function(ctx, next) {
    if (!ctx.header || !ctx.header.authorization) {
      return;
    }
    const parts = ctx.header.authorization.split(' ');
    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];
      if (/^Bearer$/i.test(scheme)) {
        return credentials;
      }
    }
    if (!opts.passthrough) {
      ctx.throw(
        401,
        'Bad Authorization header format. Format is "Authorization: Bearer <token>"'
      );
    }
  };
};
