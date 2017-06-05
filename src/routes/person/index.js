/**
 *  Created by BoGao on 2017-05-30;
 */
import React from 'react';
import { connect } from 'dva';
import { ProfileInfo } from '../../components/person';
import PersonPublications from './person-publications';

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

      <h1>论文:
        <small>({totalPubs})</small>
      </h1>
      <PersonPublications personId={profile.id} totalPubs={totalPubs} />

    </div>
  );
};

// export default connect()(Person);

export default connect(({ person, loading }) => ({ person, loading }))(Person);
