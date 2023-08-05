import { ArrowLeftOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, history, SelectLang, useIntl } from 'umi';

import { FirstStep } from './FirstStep';
import styles from './index.less';
import { SecondStep } from './SecondStep';

const Forget: React.FC = () => {
  const [username, setUserName] = useState('');
  const [token, setToken] = useState('');

  const intl = useIntl();

  return (
    <div className={styles.container}>
      {/* <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div> */}
      <div className={styles.content}>
        <div className="ant-pro-form-login-container">
          <div className="ant-pro-form-login-top">
            <div className="ant-pro-form-login-header">
              <span className="ant-pro-form-login-title">
                {intl.formatMessage({ id: 'system.title' })}
              </span>
            </div>
          </div>
          <div
            style={{
              width: 328,
              margin: '0 auto',
            }}
          >
            {!token ? (
              <FirstStep setToken={setToken} setUserName={setUserName} />
            ) : (
              <SecondStep username={username} token={token} />
            )}
            <div style={{ marginTop: 24 }}>
              <a onClick={() => history.push('/user/login')}>
                <Space>
                  <ArrowLeftOutlined />
                  <FormattedMessage id="login.backToLogin" />
                </Space>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forget;
