/**
 *  Created by BoGao on 2017-10-10;
 */
import React from 'react';
import { Link } from 'dva/router';
import { sysconfig } from 'systems';
import { classnames } from 'utils/index';
import styles from './index-hotlinks.less';

const IndexHotLinks = ({ links, urlFunc }) => {

  const Links = links || [];

  return (
    <div className={styles.keywords}>
      <div className={classnames(styles.inner, 'keywords_inner')}>
        {Links.map((item) => {
          let query = '';
          if (sysconfig.Locale === 'zh') {
            query = item.name_zh || item.name;
          } else {
            query = item.name || item.name_zh;
          }
          return (
            <div key={query}>
              <Link to={urlFunc && urlFunc(query)}>{query}</Link>
              {/*<span>{(index === commonSearch.length - 1) ? '' : ''}</span>*/}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IndexHotLinks;
