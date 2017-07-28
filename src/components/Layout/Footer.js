import React from 'react';
import styles from './Footer.less';
import { config } from '../../utils';
import { sysconfig } from '../../systems';

const Footer = () => {
  return (
    <div className={styles.footer}>
      {/*<div className={styles.footer_aminer}>*/}
        {/*<img src="/aminer_logo.png" alt="AMiner logo" />*/}
        {/*<div>Powered By</div>*/}
      {/*</div>*/}
      {/*<div className={styles.footer_main}>*/}
        {sysconfig.Footer_Content}
      {/*</div>*/}
    </div>
  );
};
export default Footer;
