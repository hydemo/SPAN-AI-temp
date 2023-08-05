export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
      {
        name: 'forget',
        path: '/user/forget',
        component: './User/Forget',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/userManagement',
    name: 'userManagement',
    icon: 'setting',
    access: 'isSuperAdmin',
    routes: [
      {
        path: '/userManagement/userList',
        name: 'userList',
        icon: 'smile',
        component: './UserManagement/UserList',
      },
      {
        component: './404',
      },
    ],
  },
];
