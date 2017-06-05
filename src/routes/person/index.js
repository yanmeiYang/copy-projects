/**
 *  Created by BoGao on 2017-05-30;
 */
import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import { ProfileInfo } from '../../components/person';
import * as personService from '../../services/person';
import styles from './index.less';
import PersonFeaturedPapers from './person-featured-papers';


const Person = ({ dispatch, person, loading }) => {
  const { profile } = person;

  // function onSearch({ query }) {
  //   console.log('onSearch in PersonPage');
  //   dispatch(routerRedux.push({
  //     pathname: `/search/${query}/0/30`,
  //   }));
  // }

  const totalPubs = profile.indices && profile.indices.num_pubs;

  return (
    <div className="content-inner">

      <ProfileInfo profile={profile} />

      <div style={{ marginTop: 30 }} />

      <div>
        <h1 className={styles.sec_header}>参与的活动：</h1>
        <img src="/temp/WechatIMG2.jpeg" rel="参与的活动" width="700" />
      </div>

      <div>
        <div style={{ float: 'right', marginTop: 8 }}>
          <a
            href={personService.getAMinerProfileUrl(profile.name, profile.id)}
            target="_blank" rel="noopener noreferrer"
          >
            查看全部 {totalPubs} 篇论文<Icon type="right" />
          </a>
        </div>

        <h1 className={styles.sec_header}>代表性论文:</h1>

        <PersonFeaturedPapers personId={profile.id} totalPubs={totalPubs} />
      </div>


      {/* 先不要这个了。需要一个 top 的论文.
       <h1>论文:
       <small>({totalPubs})</small>
       </h1>
       <PersonPublications personId={profile.id} totalPubs={totalPubs} />
       */}
    </div>
  );
};

// export default connect()(Person);

export default connect(({ person, loading }) => ({ person, loading }))(Person);
