/**
 * Created by ranyanchuan on 2017/9/1.
 */

import React from 'react';
import { routerRedux, withRouter } from 'dva/router';
import { connect } from 'dva';
import { Button, Steps, message } from 'antd';
import DisciplineTree from './discipline-tree/index';
import SearchTree from './search-discipline/index';
import styles from './cross.less';

const Step = Steps.Step;
const steps = [
  { title: 'first', description: '输入领域一' },
  { title: 'second', description: '确认知识图谱一' },
  { title: 'third', description: '输入领域二' },
  { title: 'fourth', description: '确认知识图谱二' },
  { title: 'last', description: '笛卡尔智能分析' },

];

class Cross extends React.Component {
  state = {
    current: 1,
    query: '',
  }

  componentWillMount() {
    const hash = this.props.location.hash;
    if (hash !== '' && Number(hash.substring(1, 2)) > 1 && Number(hash.substring(1, 2)) < 6) {
      this.changeCurrent(Number(hash.substring(1, 2)));
    }
  }

  onSearch = (query) => {
    const current = this.state.current + 1;
    this.setState({ query });
    this.changeCurrent(current);
  }

  save = () => {
    const current = this.state.current + 1;
    this.changeCurrent(current);
  }

  analysis = () => {
    window.location.href = '/analysisCross';
  }
  changeCurrent = (current) => {
    this.setState({ current });
    this.props.dispatch(routerRedux.push({
      pathname: '/cross',
      hash: `#${current}`,
    }));
  }

  // 返回上级
  backStep = (num) => {
    if (num < this.state.current) {
      const current = num;
      this.changeCurrent(current);
    }
  }


  render() {
    const { current } = this.state;
    return (
      <div className={styles.searchCross}>
        <div>
          <Steps current={current - 1}>
            {steps.map((item, num) => (
              <Step key={item.title} title={item.title} description={item.description}
                    onClick={this.backStep.bind(this, num + 1)} />))}
          </Steps>
        </div>
        <div className={styles.stepsContent}>
          { (this.state.current === 1 || this.state.current === 3) &&
          <div className={styles.contentHV}>
            <SearchTree onSearch={this.onSearch} />
          </div>
          }

          { (this.state.current === 2 || this.state.current === 4) &&
          <div className={styles.contentCenter}>
            <DisciplineTree id="tree1" query={this.state.query} isEdit />
          </div>
          }
          { this.state.current === 5 &&
          <div className={styles.contentLeft}>
            <DisciplineTree id="tree1" query="data mining" isEdit={false} />
            <DisciplineTree id="tree2" query="machine learning" isEdit={false} />
          </div>
          }
        </div>

        <div className={styles.contentCenter}>
          {
            this.state.current === 5 &&
            <Button type="primary" size="large"
                    onClick={this.analysis.bind()}>交叉创新笛卡尔智能分析</Button>
          }
          {
            (this.state.current === 2 || this.state.current === 4) &&
            <Button type="primary" size="large"
                    onClick={this.save.bind()}>保存</Button>
          }
        </div>
      </div>
    );
  }
}
export default connect(({ app, loading }) => ({ app, loading }))(Cross);

