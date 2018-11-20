const Home = () => import('@/view/home/view.home');

const router = [
  {
    path: '/',
    name: '首页',
    component: Home
  }
];

export default router;
