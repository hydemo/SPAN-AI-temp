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
    path: '/',
    redirect: '/chat',
  },
  {
    path: '/chat',
    name: '消息管理',
    icon: 'setting',
    routes: [
      {
        path: '/chat',
        redirect: '/chat/chat',
      },
      {
        path: '/chat/chat',
        name: '对话列表',
        icon: 'smile',
        component: './Chat/Chat',
      },
      {
        path: '/chat/conversation',
        name: '消息列表',
        icon: 'smile',
        component: './Conversation/Conversation',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/assistant',
    name: '助理管理',
    icon: 'setting',
    routes: [
      {
        path: '/assistant',
        redirect: '/assistant/file',
      },
      {
        path: '/assistant/file',
        name: '文件列表',
        icon: 'file',
        component: './GPTFile/GPTFile',
      },
      {
        path: '/assistant/assistant',
        name: '助理列表',
        icon: 'smile',
        component: './Assistant/Assistant',
      },
      {
        path: '/assistant/userAssistant',
        name: '用户助理',
        icon: 'smile',
        component: './UserAssistant/UserAssistant',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/userManagement',
    name: '系统管理',
    icon: 'setting',
    access: 'isSuperAdmin',
    routes: [
      {
        path: '/userManagement',
        redirect: '/userManagement/userList',
      },
      {
        path: '/userManagement/userList',
        name: '用户管理',
        icon: 'setting',
        component: './UserManagement/UserList',
      },
      {
        component: './404',
      },
    ],
  },
];
