/**
 * Created by ranyanchuan on 17/7/19.
 */
import React from 'react';
import styles from './cie.less';

const Footer = () => {
  return (
    <div>
      <div className={styles.footer}>
        <div className={styles.content}>
          <div>
            <img src="/sys/cie/flogo.png" alt="" />
          </div>
          <div className={styles.info}>
            <div>CopyRight @ 2007-2008 中国电子学会 All Rights Reserved</div>
            <div> 地址：北京市海淀区玉渊潭南路普惠南里13号楼 通信地址：北京165信箱 邮编：100036 联系电话：68283461</div>
            <div>技术支持： <a href="https://cn.aminer.org/">AMiner.org</a></div>
            <div> 京ICP备12041980号</div>
            <div>京公网安备110108003006号</div>
          </div>
        </div>
      </div>
      <div className={styles.aminerInfo}>
        <img src="/aminer_logo.png" alt="AMiner logo" style={{ height: 46 }} />
      </div>
    </div>
  );
};
export default Footer;
