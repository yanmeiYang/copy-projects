/**
 *  Created by BoGao on 2017-05-30;
 */
import React from 'react';
import { connect } from 'dva';
import { Icon, InputNumber, Rate } from 'antd';
import { ProfileInfo } from '../../components/person';
import * as personService from '../../services/person';
import styles from './index.less';
import PersonFeaturedPapers from './person-featured-papers';
import ActivityList from '../../components/seminar/activityList';


const Person = ({ dispatch, person, loading, seminar }) => {
  const { profile, avgScores } = person;
  const { results } = seminar;

  // function onSearch({ query }) {
  //   console.log('onSearch in PersonPage');
  //   dispatch(routerRedux.push({
  //     pathname: `/search/${query}/0/30`,
  //   }));
  // }

  const totalPubs = profile.indices && profile.indices.num_pubs;

  return (
    <div className="content-inner">

      <ProfileInfo profile={profile}/>

      <div style={{ marginTop: 30 }}/>

      <div>
        <h1 className={styles.sec_header}>专家评分：</h1>
        <table style={{ marginBottom: 10 }}>
          {avgScores.map((score)=>{
            return (
              <tbody key={score.key}>
                {score.key==='level'&&<tr>
                  <td>演讲内容（水平）:</td>
                  <td>
                    <Rate disabled defaultValue={score.score}/>
                    <span>{score.score}</span>
                  </td></tr>
                  }
                {score.key==='content'&&<tr>
                  <td>演讲水平:</td>
                  <td>
                    <Rate disabled defaultValue={score.score}/>
                    <span>{score.score}</span>
                  </td>
                </tr>}
                {score.key==='integrated'&&<tr>
                  <td>综合评价（其它贡献）:</td>
                  <td>
                    <Rate disabled defaultValue={score.score}/>
                    <span>{score.score}</span>
                  </td>
                </tr>}
              </tbody>
            )
            })}
        </table>
      </div>

      <div>
        <h1 className={styles.sec_header}>参与的活动：</h1>
        {results.map((activity) => {
          return (
            <div key={activity.id + Math.random()}>
              <ActivityList result={activity}/>
            </div>
          )
        })}
        {/*<img src="/temp/WechatIMG2.jpeg" rel="参与的活动" width="700"/>*/}
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={{ float: 'right', marginTop: 8 }}>
          <a
            href={personService.getAMinerProfileUrl(profile.name, profile.id)}
            target="_blank" rel="noopener noreferrer"
          >
            查看全部 {totalPubs} 篇论文<Icon type="right"/>
          </a>
        </div>

        <h1 className={styles.sec_header}>代表性论文:</h1>

        <PersonFeaturedPapers personId={profile.id} totalPubs={totalPubs}/>
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

export default connect(({ person, loading, seminar }) => ({ person, loading, seminar }))(Person);
