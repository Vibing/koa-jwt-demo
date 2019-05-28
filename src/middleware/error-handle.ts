export default (ctx, next) =>
  next().catch(err => {
    if (err.status == 401) {
      ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  });
