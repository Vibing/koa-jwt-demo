import HomeController from './controller/UserController';

export default [
  {
    path: '/',
    method: 'get',
    action: HomeController.hello
  },
  {
    path: '/login',
    method: 'post',
    action: HomeController.login
  },
  {
    path: '/register',
    method: 'post',
    action: HomeController.register
  },
  {
    path: '/getUser',
    method: 'get',
    action: HomeController.getUser
  }
];
