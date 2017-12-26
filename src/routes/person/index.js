/**
 *  Created by BoGao on 2017-05-30;
 *  目前只有ccf再用这个页面。
 */
import React from 'react';
import { connect } from 'dva';
import { Icon, InputNumber, Rate, Tabs, Spin, message, Button, Tooltip } from 'antd';
import { Layout } from 'routes';
import { getTwoDecimal } from 'utils';
import * as auth from 'utils/auth';
import { ProfileInfo } from 'components/person';
import { Indices } from 'components/widgets';
import NewActivityList from 'components/seminar/newActivityList';
import * as personService from 'services/person';
import { sysconfig } from 'systems';
import styles from './index.less';
import PersonFeaturedPapers from './person-featured-papers';
// import ActivityList from '../../components/seminar/activityList';
const TabPane = Tabs.TabPane;
const Person = ({ roles, dispatch, person, seminar, publications, loading }) => {
  const { profile, avgScores } = person;
  const { results } = seminar;
  const totalPubs = profile.indices && profile.indices.num_pubs;
  let contrib = { score: 0 };
  let integrated = null;
  let level = null;
  let content = null;
  let activity_indices = null;

  if (avgScores && avgScores.length > 0) {
    for (const item of avgScores) {
      if (item.key === 'contrib') {
        contrib = item;
        activity_indices = { contrib: contrib.score };
      } else if (item.key === 'integrated') {
        integrated = item;
      } else if (item.key === 'level') {
        level = item;
      } else if (item.key === 'content') {
        content = item;
      }
    }
  }

  const contributionLoading = loading.effects['person/getContributionRecalculatedByPersonId'];

  const recalculatedContribution = () => {
    dispatch({
      type: 'person/getContributionRecalculatedByPersonId',
      payload: { id: profile.id },
    }).then((data) => {
      if (data.status) {
        dispatch({ type: 'person/getActivityAvgScoresByPersonIdSuccess', payload: { data } });
        message.success('重新计算贡献度成功');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    });
  };

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
          <tr>
            <td>贡献度:</td>
            <td>
              {/* <Rate disabled defaultValue={contrib.score}/> */}
              <span style={{ marginRight: 20 }}>{contrib.score}</span>
              {auth.isSuperAdmin(roles) &&
              <Tooltip title="重新计算贡献度按钮">
                <Button size="small" loading={contributionLoading}
                        onClick={recalculatedContribution}>
                  <i className="fa fa-retweet" />
                </Button>
              </Tooltip>}
            </td>
          </tr>
        </thead>
        <tbody key={level}>
          {level && (level.score || level.score === 0) &&
          <tr>
            <td>演讲水平:</td>
            <td>
              <Rate disabled defaultValue={level.score} />
              <input type="text" className="score" value={getTwoDecimal(level.score, 2)}
                     disabled />
            </td>
          </tr>}
          {content && (content.score || content.score === 0) &&
          <tr>
            <td>演讲内容:</td>
            <td>
              <Rate disabled defaultValue={content.score} />
              <input type="text" className="score" value={getTwoDecimal(content.score, 2)}
                     disabled />
            </td>
          </tr>}
          {integrated && (integrated.score || integrated.score === 0) &&
          <tr>
            <td>综合评价:</td>
            <td>
              <Rate disabled defaultValue={integrated.score} />
              <input type="text" className="score" value={getTwoDecimal(integrated.score, 2)}
                     disabled />
            </td>
          </tr>}
        </tbody>
      </table>
    </div>,
  }, {
    title: '参与的活动',
    desc: 'seminar',
    content: <Spin spinning={seminar.loading}>
      {results.length > 0 ?
        <div style={{ minHeight: 150 }}>
          {results.map((activity) => {
            return (
              <div key={activity.id + Math.random()}>
                {/* <ActivityList result={activity} /> */}
                <NewActivityList result={activity} hidetExpertRating="false"
                                 style={{ marginTop: 20, maxWidth: 1000 }} />
              </div>
            );
          })}
        </div>
        :
        <div style={{ minHeight: 150, textAlign: 'center' }}>
          <span style={{ fontSize: '32px', color: '#aaa' }}>没有数据</span>
        </div>}
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

  return (
    <Layout searchZone={[]}>
      <div className="content-inner">
        {activity_indices && (activity_indices.contrib || activity_indices.contrib === 0) &&
        <ProfileInfo profile={profile} activity_indices={activity_indices}
                     rightZoneFuncs={sysconfig.PersonList_RightZone} />
        }
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
export default connect(({ app, person, loading, seminar, publications }) => ({
  roles: app.roles,
  person,
  loading,
  seminar,
  publications,
}))(Person);
