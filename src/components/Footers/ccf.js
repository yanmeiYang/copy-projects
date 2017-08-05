/**
 * Created by yangyanmei on 17/7/19.
 */
import React from 'react';
import styles from './ccf.less';

const Footer = () => {
  return (
    <div>
      <div className={styles.footer_main}>
        <div className={styles.footer_main_desc}>
          <a href="javascript:void(0)">
            <img src="/sys/ccf/footer-btm1.png" alt="" />
          </a>
          <div>
            <p>为计算机领域的专业人士服务</p>
            <p>Serving the professionals in computing</p>
          </div>
          <div>
            <p>技术支持：
              <a href="https://cn.aminer.org/">AMiner.org</a>
            </p>
          </div>
        </div>
        <div>
          <div className={styles.heading_bottom}>
            <h3>联系我们</h3>
          </div>
          <div className="">
            <div className={styles.heading_contact_content}>
              <div className={styles.margin_right_10}>
                <span>
                  地址：
                </span>
              </div>
              <p>北京市科学院南路6号</p>
            </div>
            <div className={styles.heading_contact_content}>
              <div className={styles.margin_right_10}>
                <span>
                  电话：
                </span>
              </div>
              <p> (+86)10 6256 2503</p>
            </div>
            <div className={styles.heading_contact_content}>
              <div className={styles.margin_right_10}>
                <span>
                  邮件：
                </span>
              </div>
              <p>ccf@ccf.org.cn<br />suggest@ccf.org.cn</p>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.heading_bottom}>
            <h3>关注我们</h3>
          </div>
          <div className={styles.heading_followUs}>
            <img src="/sys/ccf/foot-weibo.jpg" alt="weibo" />
            <img src="/sys/ccf/foot-wechart.jpg" alt="wechart" />
          </div>
        </div>
      </div>
      <div className={styles.footer_aminer}>
        <div className={styles.footer_aminer_copyright}>
          2017 © 中国计算机学会.
          <span className={styles.footer_aminer_icp}>京ICP备13000930号-4</span>
          <span className={styles.footer_aminer_bpn}>京公网安备11010802017125号</span>
          <div style={{ height: 20 }}><img src="/sys/ccf/foot-beian.png" alt="京公网安备" style={{ width: 20 }} /></div>
        </div>
        <div>
          <img src="/aminer_logo.png" alt="AMiner logo" style={{ height: 46 }} />
        </div>
      </div>
    </div>
  );
};
export default Footer;
