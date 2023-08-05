import cookies from 'js-cookie';
import { useEffect } from 'react';
import { Outlet, history } from 'umi';

import './index.scss';

export default function Layout() {
  useEffect(() => {
    const token = cookies.get('web_access_token');
    if (!token) {
      history.push('/login');
    }
  }, []);

  return (
    <div className="container">
      <Outlet />
    </div>
  );
}
