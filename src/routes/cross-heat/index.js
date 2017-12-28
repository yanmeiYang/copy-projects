/**
 * Created by ranyanchuan on 2017/10/18.
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Steps } from 'antd';
import { Auth } from 'hoc';
import { Layout } from 'routes';
import { applyTheme } from 'themes';
import styles from './index.less';

const tc = applyTheme(styles);


const dataTitle = ['科研趋势分析', '交叉热点挖掘', '学者关系探测', '专家地图分布'];
const dataSrc = ['/funcs/cross-heat/trend.png', '/funcs/cross-heat/cross.jpeg', '/funcs/cross-heat/xuezhe.jpeg', '/funcs/cross-heat/map.jpeg']
const dataEn = ['Trend', 'Cross', 'Relations', 'Maps'];

const dataList = {
  title: '科技情报深度洞察',
  describe1: '最新科研趋势，潜在交叉热点，深度学者关系，领域专家分布',
  describe2: '科技情报一网打尽，助您站在巨人肩膀上看未来',


}

@connect(({ app, loading, crossHeat }) => ({
  app,
  loading,
  crossHeat,
}))
@Auth
export default class CrossIndex extends React.Component {
  goCreate = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/cross/startTask',
    }));
  }
  goProject = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/cross/taskList',
    }));
  }

  render() {
    return (
      <Layout searchZone={[]} contentClass={tc(['crossIndex'])} showNavigator={false}>
        <div>

          <div className={styles.introduce}>
            <div className={styles.group}>

              <div className={styles.title}>{dataList.title}</div>
              <div className={styles.descript}>{dataList.describe1}</div>
              <div className={styles.descript}>{dataList.describe2}</div>
              <h1 className={styles.create}>
                <span onClick={this.goCreate}>挖掘热点</span>
                <span onClick={this.goProject}>我的项目</span>
              </h1>
            </div>
          </div>
          <h1 className={styles.hCenter}>----核心服务----</h1>
          <div className={styles.example}>
            <a href="/trend?query=communication network" target="_blank">
              <div className={styles.item}>
                <div className={styles.img}>
                  <img src={dataSrc[0]}
                       alt={dataTitle[0]} />
                </div>
                <h2>{dataTitle[0]}</h2>
                <h2>{dataEn[0]}</h2>
              </div>
            </a>

            <a href="/cross/heat/5a3251de9ed5db948cea80f9" target="_blank">
              <div className={styles.item}
              >
                <div className={styles.img}>
                  <img src={dataSrc[1]}
                       alt={dataTitle[1]} />
                </div>
                <h2>{dataTitle[1]}</h2>
                <h2>{dataEn[1]}</h2>
              </div>
            </a>

            <a href="/relation-graph-page?query=communication network" target="_blank">
              <div className={styles.item}
              >
                <div className={styles.img}>
                  <img src={dataSrc[2]}
                       alt={dataTitle[2]} />
                </div>
                <h2>{dataTitle[2]}</h2>
                <h2>{dataEn[2]}</h2>
              </div>
            </a>

            <a href="/expert-map?query=communication network" target="_blank">
              <div className={styles.item}
              >
                <div className={styles.img}>
                  <img src={dataSrc[3]}
                       alt={dataTitle[3]} />
                </div>
                <h2>{dataTitle[3]}</h2>
                <h2>{dataEn[3]}</h2>
              </div>
            </a>


          </div>

        </div>
      </Layout>
    )
      ;
  }
}


