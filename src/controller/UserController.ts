import HomeService from '../service/UserService';

export default class HomeController {
  static async hello(ctx) {
    ctx.body = await HomeService.hello();
  }

  /**
   * 登录
   * @date 2019-05-16
   * @static
   * @param {*} ctx
   * @memberof HomeController
   */
  static async login(ctx) {
    const user = ctx.request.body;

    const u: any = await HomeService.login(user);
    ctx.set({
      Authorization: u.token
    });
    ctx.body = u;
  }

  /**
   * 注册
   * @date 2019-05-16
   * @static
   * @param {*} ctx
   * @memberof HomeController
   */
  static async register(ctx) {
    try {
      const user = ctx.request.body;
      const data = await HomeService.register(user);
      ctx.body = data;
    } catch (error) {
      ctx.body = error;
    }
  }

  static async getUser(ctx) {
    const data = await HomeService.getUser(ctx);
    console.log('user-->', data);

    ctx.body = data;
  }
}
