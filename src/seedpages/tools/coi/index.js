/**
 * Created by yangyanmei on 18/2/6.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Tooltip } from 'antd';
import queryString from 'query-string';
import { Layout } from 'components/layout';
import { theme, applyTheme } from 'themes';
import { Auth } from 'hoc';
import { Spinner } from 'components';
import UserModal from './userModal';
import * as ConflictsService from 'services/coi-service';
import NewPersonList from './components/NewPersonList';
import styles from './index.less';

const tc = applyTheme(styles);
@connect(({ app, loading, conflicts }) => ({ app, loading, conflicts }))
@Auth
export default class Conflicts extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
  }

  componentWillMount() {
    const originTextRight = JSON.parse(localStorage.getItem('originTextRight'));
    const originTextLeft = JSON.parse(localStorage.getItem('originTextLeft'));
    let personListRight;
    let personListLeft;
    if (originTextRight && originTextLeft) {
      personListRight = ConflictsService.stringToJson(originTextRight);
      personListLeft = ConflictsService.stringToJson(originTextLeft);
    }
    if (personListLeft) {
      this.getPersonInfo(personListLeft, 'left');
    }
    if (personListRight) {
      this.getPersonInfo(personListRight, 'right');
    }
  }

  getPersonInfo = (personList, cId) => {
    this.props.dispatch({
      type: 'conflicts/fetchPersonInfo',
      payload: { originText: '', personList, cId },
    });
  };
  conflicts = () => {
    const { coyear } = queryString.parse(this.props.location.search);
    this.props.dispatch({
      type: 'conflicts/getRelation',
      payload: { year: coyear },
    });
  };

  showCoauthor = (data) => {
    const { coyear } = queryString.parse(this.props.location.search);
    if (data.length === 0) {
      return (
        <span>未检测出关系</span>
      );
    }
    const relation = data.map((item) => {
      if (item.type === 'coauthor') {
        return (
          <div key={Math.random()}>
            <div className={styles.relaitonResults}>
              <span className={styles.person}>{item.name1}</span>与
              <span className={styles.person}>{item.name2}</span>
              <span>近{coyear}年合作论文数</span>
              <span className={styles.coAuthorCount}>{item.count || 0}</span>
            </div>
          </div>
        );
      } else if (item.type === '学生' || item.type === '老师') {
        return (
          <div key={Math.random()}>
            <div className={styles.relaitonResults}>
              <span className={styles.person}>{item.name1}</span>是
              <span className={styles.person}>{item.name2}</span>的
              <span className={styles.coAuthorCount}>{item.type}</span>
              的概率为
              <span className={styles.coAuthorCount}>
                {item.name1 - item.name2 >= 0 ? '80%' : '78%'}
              </span>
            </div>
          </div>
        );
      } else if (item.type === 'affiliation') {
        return (
          <div key={Math.random()}>
            <div className={styles.relaitonResults}>
              <span className={styles.person}>{item.name1}</span>和
              <span className={styles.person}>{item.name2}</span>
              <Tooltip title={
                <div>
                  <div><span>{item.name1} :</span>
                    <span>{item.affiliation1}</span>
                  </div>
                  <div>
                    <span>{item.name2} :</span>
                    <span>{item.affiliation2}</span>
                  </div>
                </div>} placement="top">
                在同一单位的概率为
                <span className={styles.coAuthorCount}>{item.similarity}</span>
              </Tooltip>
            </div>
          </div>
        );
      } else {
        return (<span />);
      }
    });
    return relation;
  };
  testData = () => {
    const { dispatch } = this.props;
    const personListLeft = [
      { name: 'jie tang', org: 'tsinghua university' },
      { name: 'Jeff Z Pan', org: '' },
      { name: 'Jiannong Cao', org: 'Department of Computing' }];
    const personListRight = [
      { name: 'juanzi li', org: 'tsinghua university' },
      { name: 'Lizhu Zhou', org: '清华大学计算机科学与技术系' },
      { name: 'Guilin Qi', org: 'School of Computer Science and Engineering' },
      { name: 'Dong-Sheng Li', org: '' }];
    const originTextLeft = 'jie tang,tsinghua university\n' + '53f4326bdabfaee02aca0b88,Jeff Z Pan\n' +
      'Jiannong Cao,Department of Computing';
    const originTextRight = 'juanzi li,tsinghua university\n' +
      'Lizhu Zhou,清华大学计算机科学与技术系\n' +
      'Guilin Qi,School of Computer Science and Engineering\n' +
      'Dong-Sheng Li\n';
    dispatch({
      type: 'conflicts/fetchPersonInfo',
      payload: {
        originText: originTextLeft,
        personList: personListLeft,
        cId: 'left',
      },
    });
    dispatch({
      type: 'conflicts/fetchPersonInfo',
      payload: {
        originText: originTextRight,
        personList: personListRight,
        cId: 'Right',
      },
    });
  };

  render() {
    const { conflicts, loading } = this.props;
    const personInfoLeft = conflicts.get('personInfoLeft');
    const personInfoRight = conflicts.get('personInfoRight');
    const relation = conflicts.get('relation');
    const load = loading.effects['conflicts/getRelation'];
    const loadOrigin = loading.effects['conflicts/fetchPersonInfo'];
    return (
      <Layout searchZone={[]} contentClass={tc(['conflicts'])} showNavigator>
        <div>
          <a onClick={this.testData} className={styles.testData}>测试数据</a>
        </div>
        <div className={styles.nsfcIndexPage}>
          <div className={styles.formComponent}>
            <Spinner loading={loadOrigin} />
            <UserModal cId="left" />
            {personInfoLeft && <NewPersonList cId="left" showTitle="true" />}
          </div>

          <Button size="large" className={styles.compareBtn} onClick={this.conflicts}>
            检测
          </Button>
          <div className={styles.formComponent}>
            <Spinner loading={loadOrigin} />
            <UserModal cId="right" />
            {personInfoRight && <NewPersonList cId="right" showTitle="true" />}
          </div>
        </div>

        {/*结果*/}
        <div className={styles.showResultsBlock}>
          <Spinner loading={load} />
          {relation &&
          <div className={styles.resultsShow}>
            {this.showCoauthor(relation)}
          </div>}
        </div>
      </Layout>
    );
  }
}
