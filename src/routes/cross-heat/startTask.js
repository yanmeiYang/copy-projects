/**
 * Created by ranyanchuan on 2017/9/1.
 */

import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Input, Steps, message, Alert } from 'antd';
import { Layout } from 'routes';
import { Auth } from 'hoc';
import Autosuggest from 'react-autosuggest';
import { applyTheme } from 'themes';
import DisciplineTree from './discipline-tree/index';
import styles from './startTask.less';

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
const errorInfo = ['学科数量必须在3～20之间，请添加子领域或返回上一步重新输入', '学科数量必须在3～20之间，请删减后提交', '领域值不能为空或者特殊字符，请输入正确领域名称后再提交'];
const crossTooltip = '请注意笛卡尔智能分析是对两个领域的各个子领域进行交叉分析，耗时根据领域知识图谱的大小而定，时长可能达到几到几十小时，请耐心等待。';
const getSuggestionValue = suggestion => suggestion.phrase;
const renderSuggestion = suggestion => suggestion.phrase;


@Auth
class StartTask extends React.Component {
  state = {
    current: 1,
    queryOne: '',
    queryTwo: '',
    loading: false,
  }
  oneInputChange = false;
  twoInputChange = false;
  inputValueOne = '';
  inputValueTwo = '';
  suggestions = [];

  componentWillMount() {
    this.props.dispatch(routerRedux.push({
      pathname: '/cross/startTask',
      hash: '#1',
    }));
  }

  componentWillUpdate(nextProps, nextState) {
    const { suggest, } = this.props.crossHeat;
    if (nextProps.crossHeat.suggest !== suggest) {
      this.suggestions = nextProps.crossHeat.suggest;
    }
  }


  changeCadidate = (candidate, queryData) => {
    // const temp=[];
    const key = this.getNodeName(candidate, []);
    const tree = this.getNodeName(queryData, []);
    const differenceABSet = key.filter(x => ![...tree].find(n => n === x));
    return differenceABSet.slice(0, 40);
  }
  changeCurrent = (size) => {
    const current = this.state.queryOne !== '' ? size : 1;
    this.setState({ current });
    this.props.dispatch(routerRedux.push({
      pathname: '/cross/startTask',
      hash: `#${current}`,
    }));
  };
  // auto message
  onSuggestionsFetchRequested = ({ value }) => {
  };
  onSuggestionsClearRequested = () => {
    this.suggestions = [];
  };

  onChangeQuery = (event, { newValue, method }) => {
    if (this.state.current === 1) {
      this.oneInputChange = true;
      this.setState({ queryOne: newValue });
    } else {
      this.twoInputChange = true;
      this.setState({ queryTwo: newValue });
    }

    this.inputValue = newValue;
    if (newValue.trim() !== '') {
      const params = { query: newValue };
      this.props.dispatch({ type: 'crossHeat/getSuggest', payload: params });
    }
  };

  onKeyPress = (event) => {
    if (event.keyCode === 13) {
      this.next();
    }
  }

  next = () => {
    const { queryOne, queryTwo, current } = this.state;
    const cur = current + 1;
    const one = (cur === 2 && queryOne === '');
    const two = (cur === 4 && queryTwo === '');
    let isChange = true;
    if (one || two) {
      message.error(errorInfo[2]);
      isChange = false;
    }

    if (!one && (this.inputValueOne !== queryOne)) {
      this.inputValueOne = queryOne;
      this.getCandidate(queryOne, 'candidateOne');
    }
    if (!two && (this.inputValueTwo !== queryTwo)) {
      this.inputValueTwo = queryTwo;
      this.getCandidate(queryTwo, 'candidateTwo');
    }
    if (cur === 3 || cur === 5) {
      const id = cur === 3 ? 'queryOne' : 'queryTwo';
      const children = this.getNodeChildren(this.props.crossHeat[id], []);
      if (children.length < 3) {
        message.error(errorInfo[0]);
        isChange = false;
      }
      if (children.length > 20) {
        message.error(errorInfo[1]);
        isChange = false;
      }
    }
    if (isChange) {
      this.changeCurrent(cur);
    }
  };
  back = () => {
    this.oneInputChange = false;
    this.twoInputChange = false;
    const current = this.state.current - 1;
    this.changeCurrent(current);
  };

  getNodeChildren = (tree, children) => {
    children.push(tree.name);
    if (tree.children.length > 0) {
      tree.children.map((item) => {
        this.getNodeChildren(item, children);
        return true;
      });
    }
    return children;
  }
  // getNde
  getNodeName = (tree, temp) => {
    if (tree && tree.name) {
      temp.push(tree.name);
    }
    if (tree && tree.children && tree.children.length > 1) {
      tree.children.map((item) => {
        this.getNodeName(item, temp);
        return true;
      });
    }
    return temp;
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

// 对生成的树进行格式化
  delTreeId = (tree) => {
    delete tree.id;
    if (tree.children.length > 1) {
      tree.children.map((item) => {
        if (item.children) {
          this.delTreeId(item);
        }
        return true;
      });
    }
    return tree;
  }

  analysis = () => {
    this.setState({ loading: true });
    const one = this.formatTree(this.props.crossHeat.queryOne);
    const two = this.formatTree(this.props.crossHeat.queryTwo);
    const params = {
      _1: this.delTreeId(one),
      _2: this.delTreeId(two),
    };
    const that = this;
    this.props.dispatch({ type: 'crossHeat/addCrossField', payload: params })
      .then(() => { //页面跳转到 热力图页面
        const decareID = this.props.crossHeat.decareID;
        that.setState({ loading: false });
        that.props.dispatch(routerRedux.push({
          pathname: '/cross/report/' + decareID,
        }));
      });
  }

  getCandidate = (key, id) => {
    const area = key.replace(/ /g, '_');
    const params = { id, area, k: 5, depth: 4 };
    this.props.dispatch({ type: 'crossHeat/getDiscipline', payload: params });
  }

  renderSuggestionsContainer = ({ containerProps, children }) => (
    <div {...containerProps}>
      {children}
    </div>
  );


  dragStart = (event) => {
    event.dataTransfer.setData('Text', event.target.id);
  }

  drop = (event) => {
    event.preventDefault();
  }

  delTreeNode=()=>{
    console.log("heiheiheihe");
    console.log("================");
  }


  render() {
    const { current, queryOne, queryTwo } = this.state;
    const { candidateOne, candidateTwo } = this.props.crossHeat;
    const treeOne = this.props.crossHeat.queryOne;
    const treeTwo = this.props.crossHeat.queryTwo;
    const inputProps = {
      placeholder: current === 1 ? descripts[0] : descripts[1],
      value: current === 1 ? queryOne : queryTwo,
      onChange: this.onChangeQuery,
      onKeyUp: this.onKeyPress,
    };

    const oneList = [];
    const twoList = [];
    if (queryOne && candidateOne) {
      oneList.push(...this.changeCadidate(candidateOne, treeOne));
    }
    if (queryTwo && candidateTwo) {
      twoList.push(...this.changeCadidate(candidateTwo, treeTwo));
    }
    return (
      <Layout searchZone={[]} contentClass={tc(['startTask'])} showNavigator={false}>
        <div className={styles.step}>
          <Steps current={current - 1}>
            {steps.map((item, num) => (
              <Step key={num} title={item.title} />
            ))}
          </Steps>
        </div>
        { current === 1 &&
        <div>
          <div className={styles.contentSearch}>
            <Autosuggest
              suggestions={this.suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              renderSuggestionsContainer={this.renderSuggestionsContainer} />
            <span className={styles.btnSubmit} onClick={this.next}>智能生成</span>
          </div>
        </div>
        }
        { current === 2 &&
        <div className={styles.contentTree}>
          <DisciplineTree id="queryOne" delTreeNode={this.delTreeNode} isSearch={this.oneInputChange} query={queryOne} isEdit />
          <div draggable className={styles.drag}>
            {oneList && oneList.map((item, index) => {
              return (
                <div draggable key={index} className={styles.drapItem}>
                  <span
                    draggable
                    onDrop={this.drop}
                    onDragStart={this.dragStart}
                    id={item}>{item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        }
        { current === 3 &&
        <div className={styles.contentSearch}>
          <Autosuggest
            suggestions={this.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            renderSuggestionsContainer={this.renderSuggestionsContainer} />
          <span className={styles.btnSubmit} onClick={this.next}>智能生成</span>
        </div>
        }
        { current === 4 &&
        <div className={styles.contentTree}>
          <DisciplineTree id="queryTwo" isSearch={this.twoInputChange} query={queryTwo} isEdit />
          <div className={styles.drag}>
            {twoList && twoList.map((item, index) => {
              return (
                <div draggable key={index} className={styles.drapItem}>
                  <span draggable
                        onDrop={this.drop}
                        onDragStart={this.dragStart}
                        id={item}>{item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        }
        { current === 5 &&
        <div>
          <div className={styles.contentTree}>
            <DisciplineTree id="queryOne" query={queryOne} isEdit={false} />
            <DisciplineTree id="queryTwo" query={queryTwo} isEdit={false} />
          </div>
          <div className={styles.btnDiv}>
            <Button type="default" size="large" onClick={this.back}>上一步</Button>
            <Button type="primary" size="large" loading={this.state.loading}
                    onClick={this.analysis}>交叉创新笛卡尔智能分析
            </Button>
          </div>
          <div className={styles.alert}>
            <Alert message="温馨提示" description={crossTooltip} type="info" showIcon />
          </div>
        </div>
        }
        {
          (current !== 5) &&
          <div className={styles.btnDiv}>
            {current !== 1 &&
            <Button type="default" size="large" onClick={this.back}>上一步</Button>
            }
            <Button type="primary" size="large" onClick={this.next}>下一步</Button>
          </div>
        }
      </Layout>
    );
  }
}
export default connect(({ app, loading, crossHeat }) => ({ app, loading, crossHeat }))(StartTask);

