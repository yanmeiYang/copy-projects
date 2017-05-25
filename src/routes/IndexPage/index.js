import React from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Row, Col, Card } from 'antd';
import styles from './index.less';
import SearchBox from '../../components/SearchBox';

function IndexPage({ dispatch, search }) {
  const { seminars, rosters } = search;
  let commonSearch = ['大数据', '机器学习', '社交媒体', '深度学习', '数据挖掘', '健康医疗', '计算机网络', '人机交互', '人工智能'];
  let organization = [
    {
      'title': '多媒体技术专业委员会',
      'avatars': [
        { 'name': '李波', 'avatar': 'http://www.ccf.org.cn/upload/resources/image/2016/12/02/25984_120x160c.jpg' },
        { 'name': '孙立峰', 'avatar': 'http://www.ccf.org.cn/upload/resources/image/2017/03/13/31184_120x160c.jpg' },
        { 'name': '黄　华', 'avatar': 'http://www.ccf.org.cn/upload/resources/image/2017/03/13/31185_120x160c.jpg' }],
      'total': 108,
    },
    {
      'title': '服务计算专业委员会',
      'avatars': [
        { 'name': '徐晓飞', 'avatar': 'http://www.ccf.org.cn/upload/resources/image/2017/01/20/28143_120x160c.jpg' },
        { 'name': '苏森', 'avatar': 'http://www.ccf.org.cn/upload/resources/image/2017/01/25/28195_120x160c.jpg' },
        { 'name': '冯志勇', 'avatar': 'http://www.ccf.org.cn/upload/resources/image/2017/01/25/28195_120x160c.jpg' }],
      'total': 115,
    },
    {
      'title': '高性能计算专业委员会',
      'avatars': [
        { 'name': '孙凝晖', 'avatar': 'http://www.ccf.org.cn/upload/resources/image/2017/02/14/29584_120x160c.jpg' },
        { 'name': '张云泉', 'avatar': 'http://www.ccf.org.cn/upload/resources/image/2017/02/14/29586_120x160c.png' },
        { 'name': '迟学斌', 'avatar': 'http://www.ccf.org.cn/upload/resources/image/2017/03/13/31190_120x160c.jpg' }],
      'total': 111,
    }];

  function onSearch({ query }) {
    dispatch(routerRedux.push({
      pathname: `/search/${query}/0/30`,
    }));
  }

  return (
    <div>
      <div className={styles.normal}>
        <h1>云智库搜索</h1>
        <SearchBox size="large" style={{ width: 500 }} onSearch={onSearch}/>
        {/*常用搜索*/}
        <p className={styles.commonSearch}>
          {
            commonSearch.map((query, index) => {
              return (
                <span>
                  <Link to={`/search/${query}/0/30`} key={query}>{query}</Link>
                  <span>{ ( index === commonSearch.length - 1 ) ? '' : ', '}</span>
                </span>
              )
            })
          }
        </p>
      </div>

      <div className={styles.container}>
        {/*协会组织*/}
        <Col span='10'>
          <div className={styles.headline}>
            <h2>协会组织</h2>
          </div>
          <Row className={styles.orgList}>
            <Col>
              {
                organization.map((org) => {
                  return (
                    <Card className={styles.orgCard} title={
                      <span>
                        <h3 className='ant-card-head-title'>{org.title}</h3>
                        <span>&nbsp;({org.total})</span>
                      </span>
                    } style={{ width: '80%' }} key={org.title}>
                      <ul>
                        <li>
                          {
                            org.avatars.map((avatar) => {
                              return (<img src={avatar.avatar}/>)
                            })
                          }
                        </li>
                      </ul>
                    </Card>
                  )
                })
              }
            </Col>
          </Row>
          {/*{*/}
          {/*rosters.map((roster) => {*/}
          {/*return (<p key={roster.id}>{roster.title}</p>);*/}
          {/*})*/}
          {/*}*/}
        </Col>
        <Col span='12'>
          <div className={styles.headline}>
            <h2>协会活动</h2>
          </div>
          <div className={styles.seminar}>
            {
              seminars.slice(0,3).map((seminar) => {
                return (
                  <li>
                    <div className={styles.time}>
                      <em>05月</em>
                      <div className={styles.bot}>
                        <span><b>26</b>日</span>
                        <strong>合肥</strong>
                      </div>
                    </div>
                    <div className={styles.con}>
                      <h3>{seminar.title}</h3>
                      <div className={styles.info}>
                        <p>
                          <span className="s1">活动类别：专委</span>
                          <span>
                            <em>关键字：</em>
                            会议编号：CCF-17-TC17-04N
                          </span>
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })
            }
          </div>

        </Col>
      </div>
    </div>
  );
}


export default connect(({ search }) => ({ search }))(IndexPage);
