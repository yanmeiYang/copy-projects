/**
 * Created by ranyanchuan on 2017/9/1.
 */

import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Steps } from 'antd';
import { Layout } from 'routes';
import { applyTheme } from 'themes';
import DisciplineTree from './discipline-tree/index';
import SearchTree from './search-discipline/index';
import styles from './cross.less';

const tc = applyTheme(styles);

const Step = Steps.Step;
const steps = [
  { title: 'first' },
  { title: 'second' },
  { title: 'third' },
  { title: 'fourth' },
  { title: 'last' },
];
const descripts = [
  '请输入领域一生成知识图谱',
  '请编辑并确认生成到领域知识图谱，领域一：',
  '请输入领域二生成知识图谱',
  '请编辑并确认生成到领域知识图谱，领域二：',
  '请再次确认生成的两个领域知识图谱，并点击下面按钮启动交叉创新笛卡尔智能分析',
];
const crossTooltip = '请注意笛卡尔智能分析是对两个领域的各个子领域进行交叉分析,耗时根据领域知识图谱的大小而定,时长可能达到几到几十小时,请耐心等待,分析结束后,我们将通过email提醒您.';
class Cross extends React.Component {
  state = {
    current: 1,
    queryTree1: null,
    queryTree2: null,
    isSearch: false,
  }

  componentWillMount() {
    const hash = this.props.location.hash;
    if (hash !== '' && Number(hash.substring(1, 2)) > 1 && Number(hash.substring(1, 2)) < 6) {
      this.changeCurrent(Number(hash.substring(1, 2)));
    }
  }

  onSearch = (query) => {
    if (query) {
      const current = this.state.current + 1;
      this.changeCurrent(current);
      if (current === 2) {
        this.setState({ queryTree1: query, isSearch: true, current: 2 });
      } else {
        this.setState({ queryTree2: query, isSearch: true, current: 4 });
      }
    }
  }
  save = () => {
    this.setState({ isSearch: false });
    const current = this.state.current + 1;
    this.changeCurrent(current);
  }

  analysis = () => {
    const tree1 = this.props.crossHeat.queryTree1;
    const tree2 = this.props.crossHeat.queryTree2;
    const params = {
      queryTree1: this.formatTree(tree1),
      queryTree2: this.formatTree(tree2),
    };
    const that = this;
    this.props.dispatch({ type: 'crossHeat/createDiscipline', payload: params })
      .then(() => { //页面跳转到 热力图页面
        const decareID = this.props.crossHeat.decareID;
        that.props.dispatch(routerRedux.push({
          pathname: `/heat/${decareID}`,
        }));
      });
  }
  changeCurrent = (size) => {
    const current = this.state.queryTree1 ? size : 1;
    this.setState({ current });
    this.props.dispatch(routerRedux.push({
      pathname: '/cross',
      hash: `#${current}`,
    }));
  }

  // 对生成的树进行格式化
  formatTree = (tree) => {
    const name = tree.name;
    if (tree.children.length > 1) {
      tree.children.map((item) => {
        if (item.children.length > 0) {
          this.formatTree(item);
        }
        return true;
      });
    }
    tree.children.unshift({ name, children: [] });
    return tree;
  }
  // 进度查看
  step = (num) => {
    this.setState({ isSearch: false });
    const current = num;
    this.changeCurrent(current);
  }

  render() {
    const { current, queryTree1, queryTree2 } = this.state;
    return (
      <Layout searchZone={[]} contentClass={tc(['searchCross'])} showNavigator={false}>
        <div>
          <div className={styles.step}>
            <Steps current={current - 1}>
              {steps.map((item, num) => (
                <Step key={item.title} title={item.title}
                      onClick={this.step.bind(this, num + 1)}
                />))}
            </Steps>
          </div>
          <div className={styles.descript}>
            <span>{descripts[current - 1]}</span>
            {current === 2 &&
            <span>{queryTree1 && queryTree1}</span>
            }
            {current === 4 &&
            <span>{queryTree2 && queryTree2}</span>
            }
          </div>
          <div className={styles.stepsContent}>
            { (this.state.current === 1 || this.state.current === 3) &&
            <div className={styles.contentHV}>
              <SearchTree onSearch={this.onSearch} />
            </div>
            }
            { (this.state.current === 2) &&
            <div className={styles.contentCenter}>
              <DisciplineTree id="queryTree1" isSearch={this.state.isSearch}
                              query={this.state.queryTree1} isEdit />
            </div>
            }

            { (this.state.current === 4) &&
            <div className={styles.contentCenter}>
              <DisciplineTree id="queryTree2" isSearch={this.state.isSearch}
                              query={this.state.queryTree2} isEdit />
            </div>
            }
            { this.state.current === 5 &&
            <div className={styles.contentLeft}>
              <DisciplineTree id="queryTree1" isEdit={false} />
              <DisciplineTree id="queryTree2" isEdit={false} />
            </div>
            }
          </div>
          {
            this.state.current === 5 &&
            <div>
              <div className={styles.contentCenter}>
                <Button type="primary" size="large"
                        onClick={this.analysis.bind()}>交叉创新笛卡尔智能分析</Button>
              </div>
              <div className={styles.contentCenter}>
                <span className={styles.crossTooltip}>{crossTooltip}</span>
              </div>
            </div>
          }
          {
            (this.state.current === 2 || this.state.current === 4) &&
            <div className={styles.contentCenter}>
              <Button type="primary" size="large"
                      onClick={this.save.bind()}>下一步</Button>
            </div>
          }
        </div>
      </Layout>
    );
  }
}
export default connect(({ app, loading, crossHeat }) => ({ app, loading, crossHeat }))(Cross);

