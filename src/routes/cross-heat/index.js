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
const data = [
  {
    title: 'Machine Learning & Energy',
    id: '59f28cbe9ed5db27414df00f',
    src: '/funcs/cross-heat/energy.png',
  },
  {
    title: 'Data Mining & Health Care',
    id: '59f28d179ed5db27414df078',
    src: '/funcs/cross-heat/heath.png',
  },
  {
    title: 'Artificial Intelligence & Physical Security',
    id: '59f28dd29ed5db27414df1d8',
    src: '/funcs/cross-heat/security.png',
  },
]

const dataList = {
  title: '科技情报深度洞察',
  describe: '任意两个科研领域，系统自动计算领域知识图谱，并进行笛卡尔交叉热点深度挖掘，捕捉趋势，预见未来',

}

@Auth
class CrossIndex extends React.Component {
  goReport = (value) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/cross/report/' + value,
    }));
  };
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
              <div className={styles.descript}>{dataList.describe}</div>
              <h1 className={styles.create}>
                <span onClick={this.goCreate}>挖掘热点</span>
                <span onClick={this.goProject}>我的项目</span>
              </h1>
            </div>
          </div>
          <h1 className={styles.hCenter}>----经典案例----</h1>
          <div className={styles.example}>
            {
              data.map((item, index) => {
                return (
                  <div className={styles.item} key={index}
                       onClick={this.goReport.bind(this, item.id)}>
                    <div className={styles.img}>
                      <img src={item.src}
                           alt={item.title} />
                    </div>
                    <h2>{item.title}</h2>
                  </div>)
              })
            }
          </div>

        </div>
      </Layout>
    );
  }
}
export default connect(({ app, loading, crossHeat }) => ({
  app,
  loading,
  crossHeat,
}))(CrossIndex);

