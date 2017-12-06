/**
 * Created by yangyanmei on 17/5/31.
 */
import React from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import { Layout } from 'routes';
import PosterPage from './posterPage';
import DetailPage from './detailPage';
import styles from './index.less';


class DetailSeminar extends React.PureComponent {
  state = {
    showPosterType: true,
  };
  changeTab = (status) => {
    this.setState({ showPosterType: !status });
  };
  // FIXME yanmei: 这个方法如果其他地方也用到， 可以提到utils中
  // 数字前空位补0
  pad = (num, n) => {
    let len = num.toString().length;
    while (len < n) {
      num = `0${num}`;
      len++;
    }
    return num;
  };

  render() {
    const { showPosterType } = this.state;
    return (
      <Layout searchZone={[]}>
        <div className={styles.setMaxWidth}>
          {/*TODO 海报格式先隐藏*/}
          {/*{this.props.app.token &&*/}
          {/*<div style={{ textAlign: 'center' }}>*/}
            {/*{showPosterType ?*/}
              {/*<Button type="primary" style={{ width: '50%' }}*/}
                      {/*onClick={this.changeTab.bind(this, showPosterType)}>查看全部信息</Button>*/}
              {/*: <Button type="primary" style={{ width: '50%' }}*/}
                        {/*onClick={this.changeTab.bind(this, showPosterType)}>查看简单版</Button>}*/}
          {/*</div>}*/}
          {/*{ showPosterType ?*/}
            {/*<PosterPage pad={this.pad} /> : <DetailPage pad={this.pad} /> }*/}
          <DetailPage pad={this.pad} />
        </div>
      </Layout>
    );
  }
}
export default connect(({ app }) => ({ app }))(DetailSeminar);
