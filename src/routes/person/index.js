/**
 *  Created by BoGao on 2017-05-30;
 *  目前只有ccf再用这个页面。
 */
import React from 'react';
import { connect } from 'dva';
import { Icon, InputNumber, Rate, Tabs, Spin } from 'antd';
import { Button } from 'antd';
import { Layout } from 'routes';
import { getTwoDecimal } from 'utils';
import { ProfileInfo } from 'components/person';
import { Indices } from 'components/widgets';
import NewActivityList from 'components/seminar/newActivityList';
import * as personService from 'services/person';
import { sysconfig } from 'systems';
import styles from './index.less';
import PersonFeaturedPapers from './person-featured-papers';
// import ActivityList from '../../components/seminar/activityList';
const TabPane = Tabs.TabPane;
const Person = ({ dispatch, person, seminar, publications }) => {
  const { profile, avgScores } = person;
  const { results } = seminar;
  const totalPubs = profile.indices && profile.indices.num_pubs;
  const contrib = avgScores.filter(score => score.key === 'contrib')[0];
  const integrated = avgScores.filter(score => score.key === 'integrated')[0];
  const activity_indices = { contrib: contrib === undefined ? 0 : contrib.score };

  // const recomputeContribution = () => {
  //   console.log('6666666')
  // }
  const profileTabs = [{
    isShow: sysconfig.ShowRating,
    title: '专家评分',
    desc: 'expert-rating',
    content: <div>
      {false && profile && profile.indices &&
      <Indices indices={profile.indices} />
      }
      <table style={{ marginBottom: 10 }} className="scoreTable">
        <thead>
        {contrib &&
        <tr>
          <td>贡献度:</td>
          <td>
            {/* <Rate disabled defaultValue={contrib.score}/> */}
            <span style={{ marginRight: 72 }}>{contrib.score}</span>
            {/*<Button type="primary" size="small" onClick={this.recomputeContribution.bind(this)}>重新计算贡献度</Button>*/}
          </td>
        </tr>
        }
        </thead>
        {avgScores.map((score) => {
          return (
            <tbody key={score.key}>
            {score.key === 'level' &&
            <tr>
              <td>演讲内容:</td>
              <td>
                <Rate disabled defaultValue={score.score} />
                <input type="text" className="score" value={getTwoDecimal(score.score, 2)}
                       disabled />
              </td>
            </tr>
            }
            {score.key === 'content' &&
            <tr>
              <td>演讲水平:</td>
              <td>
                <Rate disabled defaultValue={score.score} />
                <input type="text" className="score" value={getTwoDecimal(score.score, 2)}
                       disabled />
              </td>
            </tr>
            }
            </tbody>
          );
        })}
        <tfoot>
        {integrated &&
        <tr>
          <td>综合评价:</td>
          <td>
            <Rate disabled defaultValue={integrated.score} />
            <input type="text" className="score" value={getTwoDecimal(integrated.score, 2)}
                   disabled />
          </td>
        </tr>
        }
        </tfoot>
      </table>
    </div>,
  }, {
    title: '参与的活动',
    desc: 'seminar',
    content: <Spin spinning={seminar.loading}>
      {results.length > 0 ? <div style={{ minHeight: 150 }}>{results.map((activity) => {
        return (
          <div key={activity.id + Math.random()}>
            {/* <ActivityList result={activity} /> */}
            <NewActivityList result={activity} hidetExpertRating="true"
                             style={{ marginTop: 20, maxWidth: 1000 }} />
          </div>
        );
      })}</div> : <div style={{ minHeight: 150, textAlign: 'center' }}><span
        style={{ fontSize: '32px', color: '#aaa' }}>没有数据</span></div>}
    </Spin>,
  }, {
    title: '代表性论文',
    desc: 'pub',
    content: <Spin spinning={publications.loading}>
      <div>
        <div style={{ float: 'right', marginTop: '-36px', position: 'relative' }}>
          <a
            href={personService.getAMinerProfileUrl(profile.name, profile.id)}
            target="_blank" rel="noopener noreferrer"
          >
            查看全部 {totalPubs} 篇论文<Icon type="right" />
          </a>
        </div>
        <PersonFeaturedPapers personId={profile.id} totalPubs={totalPubs} />
      </div>
    </Spin>,
  }];

  function getMoreSeminar(e) {
    e.target.style.display = 'none';
    dispatch({
      type: 'seminar/getSeminar',
      payload: { offset: 0, size: 10000, filter: { src: sysconfig.SYSTEM, aid: profile.id } },
    });
  }

  const personId = '';

  function callback(desc) {
    switch (desc) {
      case 'seminar':
        if (results.length > 0) {
          return '';
        } else {
          return (
            <div>
              {dispatch({ type: 'seminar/clearState' })}
              {dispatch({
                type: 'seminar/getSeminar',
                payload: {
                  offset: 0,
                  size: 5,
                  filter: { src: sysconfig.SYSTEM, aid: profile.id }
                },
              })}</div>
          );
        }
      case 'pub':
        if (publications.resultsByCitation.length > 0) {
          return '';
        } else {
          return dispatch({
            type: 'publications/getPublications',
            payload: {
              personId: profile.id,
              orderBy: 'byCitation',
              offset: 0,
              size: 5,
            },
          });
        }
      default:
        return false;
    }
  }



  // console.log('|||||||||||| PersonIndex:', person);
  return (
    <Layout searchZone={[]}>
      <div className="content-inner">
        <ProfileInfo profile={profile} activity_indices={activity_indices}
                     rightZoneFuncs={sysconfig.PersonList_RightZone} />
        <div style={{ marginTop: 30 }} />

        <div>
          <Tabs defaultActiveKey="0" onTabClick={callback}>
            {profileTabs.filter(item => (item.isShow !== false)).map((item) => {
              return (
                <TabPane key={item.desc} tab={item.title}>
                  {item.content}
                </TabPane>
              );
            })}
          </Tabs>
        </div>

        {/* 先不要这个了。需要一个 top 的论文.
         <h1>论文:
         <small>({totalPubs})</small>
         </h1>
         <PersonPublications personId={profile.id} totalPubs={totalPubs} />
         */}
        {/* <PersonFeaturedPapers personId={profile.id} totalPubs={totalPubs}/> */}
      </div>
    </Layout>
  );
};
// export default connect()(Person);
export default connect(({ person, loading, seminar, publications }) => ({
  person,
  loading,
  seminar,
  publications,
}))(Person);
