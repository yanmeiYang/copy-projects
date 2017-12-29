/**
 *  Created by NanGu on 2017-10-17;
 *  aminer在使用这个页面
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { Link } from 'dva/router';
import { getTwoDecimal } from '../../utils';
import { AminerProfileInfo, TabZone } from '../../components/person';
import { Layout } from '../../routes';

  // console.log('|||||||||||| PersonIndex:', person);
const aminerPerson = ({ dispatch, aminerPerson, publications }) => {
  const { profile, avgScores } = aminerPerson;
  const contrib = avgScores.filter(score => score.key === 'contrib')[0];
  const activity_indices = { contrib: contrib === undefined ? 0 : contrib.score };
  return (
    <Layout>
      <div className="content-inner">

        <div style={{ marginTop: 20 }} />

        <AminerProfileInfo profile={profile} activity_indices={activity_indices} />
        <div style={{ marginTop: 30 }} />

        <div>
          <TabZone profile={profile} publications={publications} />
        </div>
      </div>
    </Layout>
  );
};

// export default connect()(Person);
export default connect(({ aminerPerson, loading, publications }) => ({
  aminerPerson,
  loading,
  publications,
}))(aminerPerson);
