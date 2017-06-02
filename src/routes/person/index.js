import React from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { ProfileInfo } from '../../components/person';
import PersonPublications from './person-publications';

const Person = ({ dispatch, person, loading }) => {
  const { profile } = person;

  // for (let key in profile) {
  //   if ({}.hasOwnProperty.call(profile, key)) {
  //     // console.log('key is : ', key)
  //     // console.log('data is : ', summary[key])
  //     content.push(
  //       (<p>{key} | </p>),
  //     );
  //   }
  // }


// function onSearch({ query }) {
//   console.log('onSearch in PersonPage');
//   dispatch(routerRedux.push({
//     pathname: `/search/${query}/0/30`,
//   }));
// }
  return (
    <div className={styles.normal}>
      <h1>这里显示专家列表</h1>

      <ProfileInfo profile={profile} />

      <PersonPublications personId={profile.id} />

    </div>
  );
};

// export default connect()(Person);

export default connect(({ person, loading }) => ({ person, loading }))(Person);
