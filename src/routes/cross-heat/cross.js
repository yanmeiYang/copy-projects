/**
 * Created by ranyanchuan on 2017/9/1.
 */

import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Steps, Alert } from 'antd';
import { Layout } from 'routes';
import { applyTheme } from 'themes';
import DisciplineTree from './discipline-tree/index';
import SearchTree from './search-discipline/index';
import styles from './cross.less';

const tc = applyTheme(styles);

const Step = Steps.Step;
const steps = [
  { id: 1, title: '输入领域一' },
  { id: 2, title: '编辑并确认' },
  { id: 3, title: '输入领域二' },
  { id: 4, title: '编辑并确认' },
  { id: 5, title: '生成热力图' },
];
const descripts = [
  '请输入领域一生成知识图谱，例如：artificial intelligence',
  '请输入领域一生成知识图谱，例如：health care',
];
const crossTooltip = '请注意笛卡尔智能分析是对两个领域的各个子领域进行交叉分析，耗时根据领域知识图谱的大小而定，时长可能达到几到几十小时，请耐心等待。';
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
        if (item.children && item.children.length > 0) {
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

  back = () => {
    const current = this.state.current;
    this.changeCurrent(current - 1);
  }

  next = () => {
    const current = this.state.current;
    this.changeCurrent(current + 1);
  }

  render() {
    const { current, isSearch, queryTree1, queryTree2 } = this.state;
    const placeNum = current === 1 ? 0 : 1;
    return (
      <Layout searchZone={[]} contentClass={tc(['searchCross'])} showNavigator={false}>
        <div>
          <div className={styles.step}>
            <Steps current={current - 1}>
              {steps.map((item, num) => (
                <Step key={num} title={item.title} onClick={this.step.bind(this, num + 1)} />
              ))}
            </Steps>
          </div>
          <div>
            { current === 1 &&
            <div className={styles.contentSearch}>
              <SearchTree onSearch={this.onSearch} placeValue={descripts[placeNum]} />
            </div>
            }
            { current === 2 &&
            <div className={styles.contentTree}>
              <DisciplineTree id="queryTree1" isSearch={isSearch} query={queryTree1} isEdit />
            </div>
            }
            { current === 3 &&
            <div className={styles.contentSearch}>
              <SearchTree onSearch={this.onSearch} placeValue={descripts[placeNum]} />
            </div>
            }
            { current === 4 &&
            <div className={styles.contentTree}>
              <DisciplineTree id="queryTree2" isSearch={isSearch} query={queryTree2} isEdit />
            </div>
            }
            { current === 5 &&
            <div>
              <div className={styles.contentTree}>
                <DisciplineTree id="queryTree1" isEdit={false} />
                <DisciplineTree id="queryTree2" isEdit={false} />
              </div>
              <div className={styles.btnDiv}>
                {/*<Button type="default" size="large" onClick={this.back}>上一步</Button>*/}
                <Button type="primary" size="large" onClick={this.analysis}>交叉创新笛卡尔智能分析</Button>
              </div>
              <div className={styles.alert}>
                <Alert message="温馨提示" description={crossTooltip} type="info" showIcon />
              </div>
            </div>
            }
          </div>
          {
            (current === 2 || current === 4) &&
            <div className={styles.btnDiv}>
              {/*<Button type="default" size="large" onClick={this.back}>上一步</Button>*/}
              <Button type="primary" size="large" onClick={this.next}>下一步</Button>
            </div>
          }
        </div>
      </Layout>
    );
  }
}
export default connect(({ app, loading, crossHeat }) => ({ app, loading, crossHeat }))(Cross);

