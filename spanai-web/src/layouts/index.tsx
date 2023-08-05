import { Outlet } from 'umi';

import './index.scss';

export default function Layout() {
  return (
    <div className="container">
      <Outlet />
    </div>
  );
}
