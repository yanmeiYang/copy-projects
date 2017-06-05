import React from 'react';
import styles from './Footer.less';
import { config } from '../../utils';

const Footer = () => {

  return (
    <div className={styles.footer}>
      <div className={styles.footer_aminer}>
        <img src="/aminer_logo.png" alt="AMiner logo" />
        <div>Powered By</div>
      </div>
      <div className={styles.footer_main}>
        <img src="/footer-btm.png" />
        <div>
          版权所有 中国计算机学会技术支持：泽元软件<br />
          联系电话： (+86)10 6256 2503邮件：ccf@ccf.org.cn京ICP备13000930号-4京公网安备11010802017125号<br />
          网站建议或者意见请发送邮件：suggest@ccf.org.cn
        </div>
      </div>
    </div>
  );
}
export default Footer;
