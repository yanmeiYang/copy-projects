/**
 * Created by yangyanmei on 17/7/27.
 */
import React from 'react';
import styles from './default.less';

const Footer = () => {
  return (
    <div>
      <div className={styles.footer_aminer}>
        <div className={styles.footer_aminer_copyright}>
          {/*2017 © xxxx.*/}
          {/*<span className={styles.footer_aminer_icp}>京ICP备xxxxxxxx号-4</span>*/}
          {/*<span className={styles.footer_aminer_bpn}>京公网安备11010802017125号</span>*/}
          {/*<div style={{ height: 20, lineHeight: '30px' }}><img src="/sys/ccf/foot-p.png" alt="京公网安备" style={{ width: 20 }} /></div>*/}
        </div>
        <div>
          <img src="/aminer_logo.png" alt="AMiner logo" style={{ height: 46, marginTop: 4 }}/>
        </div>
      </div>
    </div>
  );
};
export default Footer;
