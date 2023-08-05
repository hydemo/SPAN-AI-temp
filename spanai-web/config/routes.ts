export default [
  {
    path: '/',
    redirect: '/chat',
  },
  { path: "/chat", component: "Chat", layout: false },
  { path: "/login", component: "Login", layout: false },
];
