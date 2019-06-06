import { getManager } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import UserEntity from '../entity/User';
import * as crypto from 'crypto';
import secret from '../config/secret';

/* 通过payload生成token,有效时间1小时*/
const getToken = (payload = {}) =>
  jwt.sign(payload, secret.sign, { expiresIn: '1h' });

export default class HomeService {
  static hello() {
    return new Promise(resolve => resolve('hello world'));
  }

  /**
   * 登录
   * @date 2019-05-11
   * @static
   * @param {*} user
   * @memberof HomeService
   */
  static async login(user) {
    let token;
    const userRespository = getManager().getRepository(UserEntity);
    const u = await userRespository.findOne({
      where: {
        name: user.name
      }
    });
    delete u.password;

    //密码加密
    const psdMd5 = crypto
      .createHash('md5')
      .update(user.password)
      .digest('hex');

    if (u.password === psdMd5) {
      token = getToken({
        ...u
      });
    }

    return new Promise(resolve =>
      resolve({
        ...u,
        token
      })
    );
  }

  /**
   * 注册
   * @date 2019-05-11
   * @static
   * @param {*} user
   * @returns
   * @memberof HomeService
   */
  static register(user) {
    return new Promise(async (resolve, reject) => {
      if (!user.name || !user.password) {
        reject('用户名或密码非法');
      }

      const userRespository = getManager().getRepository(UserEntity);
      const u = await userRespository.findOne({
        where: {
          name: user.name
        }
      });

      if (u) {
        reject('用户已存在');
        return;
      }

      const psdMd5 = crypto
        .createHash('md5')
        .update(user.password)
        .digest('hex');
      const newUser = userRespository.create({
        name: user.name,
        password: psdMd5
      });

      userRespository.save(newUser);
      resolve({
        name: user.name,
        message: '注册成功'
      });
    });
  }

  /**
   * 获取用户信息
   * @date 2019-05-22
   * @static
   * @param {*} ctx
   * @returns
   * @memberof HomeService
   */
  static async getUser(ctx) {
    const userRespository = getManager().getRepository(UserEntity);
    const user = await userRespository.findOne({
      where: {
        id: ctx.state.user.id
      }
    });
    return user;
  }
}
