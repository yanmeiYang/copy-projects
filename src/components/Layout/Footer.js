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
        <img src="/footer-btm.png" alt="footer" />
        <div>
          版权所有 中国计算机学会技术支持：AMiner.org<br />
          网站建议或者意见请发送邮件：suggest@ccf.org.cn
        </div>
      </div>
    </div>
  );
};
export default Footer;
