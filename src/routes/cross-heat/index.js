/**
 * Created by zenensen on 2017/10/18.
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Steps } from 'antd';
import { Layout } from 'routes';
import { applyTheme } from 'themes';
import styles from './index.less';

const tc = applyTheme(styles);
const data = [
  {
    title: 'Artificial Intelligence & Health Care',
    id: '59e5bf489ed5db1d9cf76056',
    src: 'https://zos.alipayobjects.com/rmsportal/kYIPuuwXooUZUMjHZCMV.png'
  },
  {
    title: 'Data mining & Physics',
    id: '59e569e79ed5db1d9cf6c149',
    src: 'https://zos.alipayobjects.com/rmsportal/PPTJClMTYOrsfJefqnZC.png'
  },
  {
    title: 'Machine Learning & Health Care',
    id: '59e5c0a69ed5db1d9cf76199',
    src: 'https://zos.alipayobjects.com/rmsportal/hKqMgRnvbPbUqjLLOXts.png'
  },
]


class CrossIndex extends React.Component {
  state = {}

  componentWillMount() {

  }

  goReport = (value) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/heat/' + value,
    }));
  }

  render() {
    return (
      <Layout searchZone={[]} contentClass={tc(['crossIndex'])} showNavigator={false}>
        <div>

          {/*<div>*/}
          {/*<img src="http://news.k618.cn/tech/201704/W020170425388475031941.jpg" alt=""*/}
          {/*style={{ height: 770 }} />*/}
          {/*</div>*/}

          <h1 style={{ textAlign: 'center', marginBottom: 40 }}>----优秀案例----</h1>
          <div className={styles.example}>
            {
              data.map((item) => {
                return (
                  <div className={styles.item} onClick={this.goReport.bind(this, item.id)}>
                    <img src={item.src}
                         alt="" style={{ width: 313, height: 280 }} />
                    <h3 style={{
                      textAlign: 'center',
                      marginTop: 10,
                      marginBottom: 10,
                    }}>{item.title}</h3>
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

