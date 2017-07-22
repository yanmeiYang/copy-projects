/**
 *  Created by BoGao on 2017-05-30;
 *  目前只有ccf再用这个页面。
 */
import React from 'react';
import { connect } from 'dva';
import { Icon, InputNumber, Rate, Tabs, Spin } from 'antd';
import { getTwoDecimal } from '../../utils';
import { ProfileInfo } from '../../components/person';
import { Indices } from '../../components/widgets';
import * as personService from '../../services/person';
import styles from './index.less';
import PersonFeaturedPapers from './person-featured-papers';
// import ActivityList from '../../components/seminar/activityList';
import NewActivityList from '../../components/seminar/newActivityList';

const TabPane = Tabs.TabPane;

const Person = ({ dispatch, person, seminar, publications }) => {
  const { profile, avgScores } = person;
  const { results } = seminar;
  const totalPubs = profile.indices && profile.indices.num_pubs;

  const contrib = avgScores.filter(score => score.key === 'contrib')[0];

  const profileTabs = [{
    title: '专家评分',
    content: <div>
      {false && profile && profile.indices &&
      <Indices indices={profile.indices} />
      }
      <table style={{ marginBottom: 10 }}>
        {contrib &&
          <tr>
            <td>贡献度:</td>
            <td>
              {/* <Rate disabled defaultValue={contrib.score}/>*/}
              <span>{contrib.score}</span>
            </td>
          </tr>
        }
        {avgScores.map((score) => {
          return (
            <tbody key={score.key}>
              {score.key === 'level' && <tr>
                <td>演讲内容（水平）:</td>
                <td>
                  <Rate disabled defaultValue={score.score} />
                  <span>{getTwoDecimal(score.score, 2)}</span>
                </td>
              </tr>
            }
              {score.key === 'content' &&
              <tr>
                <td>演讲水平:</td>
                <td>
                  <Rate disabled defaultValue={score.score} />
                  <span>{getTwoDecimal(score.score, 2)}</span>
                </td>
              </tr>
            }
              {score.key === 'integrated' && <tr>
                <td>综合评价（其它贡献）:</td>
                <td>
                  <Rate disabled defaultValue={score.score} />
                  <span>{getTwoDecimal(score.score, 2)}</span>
                </td>
              </tr>}
            </tbody>
          );
        })}
      </table>
    </div>,
  }, {
    title: '参与的活动',
    content: <Spin spinning={seminar.loading}>
      <div style={{ minHeight: 150 }}>{results.map((activity) => {
        return (
          <div key={activity.id + Math.random()}>
            {/* <ActivityList result={activity} />*/}
            <NewActivityList result={activity} hidetExpertRating="true" style={{ marginTop: 20, maxWidth: 1000 }} />
          </div>
        );
      })}</div>
    </Spin>,
  }, {
    title: '代表性论文',
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
      payload: { offset: 0, size: 10000, filter: { src: 'ccf', aid: profile.id } },
    });
  }

  const personId = '';

  function callback(key) {
    switch (key) {
      case '1':
        if (results.length > 0) {
          return '';
        } else {
          return (
            <div>
              {dispatch({ type: 'seminar/clearState' })}
              {dispatch({
                type: 'seminar/getSeminar',
                payload: { offset: 0, size: 5, filter: { src: 'ccf', aid: profile.id } },
              })}</div>
          );
        }
      case '2':
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

  console.log('|||||||||||| PersonIndex:', person);
  return (
    <div className="content-inner">

      <ProfileInfo profile={profile} />

      <div style={{ marginTop: 30 }} />

      <div>
        <Tabs defaultActiveKey="0" onChange={callback}>
          {profileTabs.map((item, index) => {
            return (
              <TabPane key={index} tab={item.title}>
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
      {/* <PersonFeaturedPapers personId={profile.id} totalPubs={totalPubs}/>*/}
    </div>
  );
};

// export default connect()(Person);

export default connect(({ person, loading, seminar, publications }) => ({
  person,
  loading,
  seminar,
  publications,
}))(Person);
