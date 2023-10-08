import { Button, Modal, Typography } from 'antd';
import cookies from 'js-cookie';
import { parse } from 'query-string';
import { useState } from 'react';
import { history } from 'umi';

const { Title, Paragraph, Text } = Typography;

import { IconButton } from '@/components/IconButton';
import { BotIcon } from '@/components/icons';
import { login } from '@/services/apiList/user';

import './login.scss';

export default () => {
  const query = parse(history.location.search);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [checkbox, setCheckBox] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const isLoginDisabled = !Boolean(emailValue && passwordValue && checkbox);

  const handleLogin = async () => {
    if (isLoginDisabled) {
      return;
    }

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="auth-page">
      <div className="no-dark auth-logo">
        <BotIcon />
      </div>

      <div className="auth-title">SPAN AI Chat</div>
      <input
        className="auth-input"
        type="text"
        placeholder="用户名"
        onChange={(e) => {
          setEmailValue(e.currentTarget.value);
        }}
        onKeyDown={handleKeyDown}
        value={emailValue}
      />
      <input
        className="auth-input"
        type="password"
        placeholder="密码"
        onChange={(e) => {
          setPasswordValue(e.currentTarget.value);
        }}
        onKeyDown={handleKeyDown}
        value={passwordValue}
      />
      <label key="agree" className="auth-agreement-container">
        <input
          type="checkbox"
          id="agree"
          name="agree"
          required
          className="auth-agreement-checkbox"
          onChange={(e: any) => setCheckBox(e.target.checked)}
          // onChange={changeCheckBox}
        />
        我已阅读并同意{' '}
        <a className="auth-agreement" onClick={() => setModalVisible(true)}>
          网络知晓书
        </a>
      </label>
      <div className="auth-actions">
        <IconButton
          text="登录"
          type="primary"
          onClick={handleLogin}
          disabled={isLoginDisabled}
        />
      </div>
      <Modal
        title="网络知晓书"
        visible={modalVisible}
        width={1200}
        closeIcon={false}
        footer={null}
      >
        <div>
          <Title level={4}>尊敬的用户：</Title>
          <Paragraph>
            欢迎您访问并使用本网站。为确保您在使用过程中充分了解与我们服务相关的各项事项，特此为您提供如下知情同意须知。在您决定使用本服务前，请您务必仔细阅读、充分理解本须知的各项内容。一旦您点击“同意”并进入登录界面，即表示您已完全接受本须知的全部内容。
          </Paragraph>
          <Paragraph>
            <Title level={5}>1. 服务说明</Title>
            本网站旨在为用户提供生成式人工智能的互动接口。用户可以通过与生成式AI的互动，来辅助完成生活和工作中的诸多任务。但在此，我们强调，生成式AI并非无所不知，它的回答可能受到训练数据、算法和其他多种因素的影响。
          </Paragraph>
          <Paragraph>
            <Title level={5}>2. 信息准确性</Title>
            鉴于生成式AI的工作原理，有时它可能会产生不准确或误导性的信息。请您在使用过程中，自行判断并辨识其准确性。如有疑虑，建议进一步咨询其他权威来源。
          </Paragraph>
          <Paragraph>
            <Title level={5}> 3. 法律法规</Title>
            在使用本网站及其提供的服务时，请您遵循所在地的相关法律、法规和政策。任何违法或不当行为，本网站不承担任何责任，但我们有权中止或终止向您提供服务。
          </Paragraph>
          <Paragraph>
            <Title level={5}>4. 账号安全与保密</Title>
            考虑到本网站的目的主要是为科学研究，我们强烈建议您严格保护自己的账号密码。请勿向他人透露，更不要出借或转让给他人使用。一旦发现账号被他人使用或有其他安全隐患，您应立即通知我们。若发现账号出借，我们将采取包括但不限于封号等措施。
          </Paragraph>
          <Paragraph>
            <Title level={5}>5. 使用限制</Title>
            为确保每位用户都能够高效、稳定地使用我们的服务，我们对每个账号的互动次数和生成的总字数做了相应的限制。请您在使用过程中遵守该限制，如有特殊需求，请与我们联系。
          </Paragraph>
          <Paragraph>
            <Title level={5}>6. 数据隐私与研究</Title>
            我们非常重视用户的隐私权益。您和AI的互动内容将被严格保密，除本团队外，任何第三方或个人均无权查看或获得您的互动记录。然而，为了科学研究目的，您与AI的互动记录可能在去除所有个人身份信息后，被用于科学研究分析。这是为了推进人工智能领域的发展，更好地理解用户需求和AI的互动模式。我们确保在这一过程中，用户的隐私将得到最大程度的保护。
          </Paragraph>
          <Paragraph>
            <Title level={5}>7. 其它</Title>
            我们可能会不时地根据实际情况更新本知情同意须知，每次更新时，我们都会在本网站上发布最新版本。建议您定期查看，了解最新规定。
            感谢您的理解和支持，希望您在本网站有一个愉快的体验！
          </Paragraph>
          <Paragraph>
            点击<Text strong>“同意”</Text>
            即表示您已详细阅读、充分理解并接受以上所有条款，然后您可以顺利进入登录界面。如有任何疑问，请及时与我们联系。
          </Paragraph>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '4px',
          }}
        >
          <Button
            style={{
              backgroundColor: 'var(--primary)',
            }}
            type="primary"
            className="auth-agreement-popup-button"
            onClick={() => setModalVisible(false)}
          >
            同意
          </Button>
        </div>
      </Modal>
    </div>
  );
};
