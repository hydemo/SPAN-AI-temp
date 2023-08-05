import cookies from 'js-cookie';
import { parse } from 'query-string';
import { useState } from 'react';

import { IconButton } from '@/components/IconButton';
import { BotIcon } from '@/components/icons';
import { login } from '@/services/apiList/user';

import './login.scss';
import { history } from 'umi';

export default () => {
  const query = parse(history.location.search);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const handleLogin = async () => {
    const msg = await login({
      username: emailValue.trim(),
      password: passwordValue.trim(),
    });
    if (msg.token) {
      cookies.set('web_access_token', msg.token);
      cookies.set('web_userinfo', JSON.stringify(msg.userinfo));
      /** 此方法会跳转到 redirect 参数所在的位置 */
      const redirect = query?.redirect;
      history.push((redirect || '/chat') as any);
      // await fetchUserInfo();
      return;
    }
  };

  return (
    <div className="auth-page">
      <div className="no-dark auth-logo">
        <BotIcon />
      </div>

      <div className="auth-title">SPAN AI Chat</div>
      <div className="auth-tips">
        管理员开启了登录验证，请在下方输入用户名/密码
      </div>

      <input
        className="auth-input"
        type="text"
        placeholder="用户名"
        onChange={(e) => {
          setEmailValue(e.currentTarget.value);
        }}
        value={emailValue}
      />
      <input
        className="auth-input"
        type="password"
        placeholder="密码"
        onChange={(e) => {
          setPasswordValue(e.currentTarget.value);
        }}
        value={passwordValue}
      />

      <div className="auth-actions">
        <IconButton
          text="登录"
          type="primary"
          onClick={handleLogin}
          disabled={!Boolean(emailValue && passwordValue)}
        />
      </div>
    </div>
  );
};
