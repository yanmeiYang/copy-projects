/**
 * Created by ranyanchuan on 2017/9/1.
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Radio, Input, Steps, message, Alert } from 'antd';
import { Layout } from 'components/layout';
import { Auth } from 'hoc';
import { sysconfig } from 'systems';
import Autosuggest from 'react-autosuggest';
import { applyTheme } from 'themes';
import { filterStr } from 'services/cross-heat-service';
import DisciplineTree from './components/discipline-tree/index';
import EditDomain from './components/edit-domain/index';
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
    const { suggest } = this.props.crossHeat;
    if (nextProps.crossHeat.suggest !== suggest) {
      this.suggestions = nextProps.crossHeat.suggest;
    }
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
      const params = { query: filterStr(newValue) };
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
    }
    if (!two && (this.inputValueTwo !== queryTwo)) {
      this.inputValueTwo = queryTwo;
    }
    if (cur === 3 || cur === 5) {
      const id = cur === 3 ? 'queryOne' : 'queryTwo';
      const children = this.getNodeChildren(this.props.crossHeat[id], []);
      if (children.length < 3) {
        message.error(errorInfo[0]);
        isChange = false;
      }
      if (children.length > 21) {
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
        const { decareID } = this.props.crossHeat;
        that.setState({ loading: false });
        that.props.dispatch(routerRedux.push({
          pathname: `/cross/heat/${decareID}`,
        }));
      });
  }

  renderSuggestionsContainer = ({ containerProps, children }) => (
    <div {...containerProps}>
      {children}
    </div>
  );


  render() {
    const { current, queryOne, queryTwo } = this.state;
    const { sourceOne, sourceTwo } = this.props.crossHeat;
    const inputProps = {
      placeholder: current === 1 ? descripts[0] : descripts[1],
      value: current === 1 ? queryOne : queryTwo,
      onChange: this.onChangeQuery,
      onKeyUp: this.onKeyPress,
    };
    return (
      <Layout searchZone={[]} contentClass={tc(['startTask'])}
              showNavigator={sysconfig.Cross_HasNavigator}>
        <div className={styles.step}>
          <Steps current={current - 1}>
            {steps.map((item, num) => (
              <Step key={num.toString()} title={item.title} />
            ))}
          </Steps>
        </div>
        {current === 1 &&
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
        {current === 2 &&
        <div className={styles.contentTree}>
          <EditDomain query={queryOne} id="queryOne" source={sourceOne}
                      isSearch={this.oneInputChange} />
        </div>
        }
        {current === 3 &&
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
        {current === 4 &&
        <div className={styles.contentTree}>
          <EditDomain query={queryTwo} id="queryTwo" source={sourceTwo}
                      isSearch={this.twoInputChange} />
        </div>
        }
        {current === 5 &&
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

