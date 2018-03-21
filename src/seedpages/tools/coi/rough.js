import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Tooltip, Form, Input, Col } from 'antd';
import queryString from 'query-string';
import { Layout } from 'components/layout';
import { Auth } from 'hoc';
import * as ConflictsService from 'services/coi-service';
import { theme, applyTheme } from 'themes';
import { Spinner } from 'components';
import { Maps } from "utils/immutablejs-helpers";
import styles from './fine.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const tc = applyTheme(styles);

@Auth
class Rough extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
  }

  componentDidMount() {
    const { coyear } = queryString.parse(this.props.location.search);
    const originTextRight = JSON.parse(localStorage.getItem('originTextRight'));
    const originTextLeft = JSON.parse(localStorage.getItem('originTextLeft'));
    if (originTextLeft && originTextRight &&
      originTextLeft.length > 0 && originTextRight.length > 0) {
      const newOriginTextLeft = originTextLeft.replace(/[a-zA-Z0-9]{24},/m, '');
      const newOriginTextRight = originTextRight.replace(/[a-zA-Z0-9]{24},/m, '');
      const personListRight = ConflictsService.stringToJson(originTextRight);
      const personListLeft = ConflictsService.stringToJson(originTextLeft);
      this.props.form.setFieldsValue({
        userNameLeft: newOriginTextLeft,
        userNameRight: newOriginTextRight,
      });
      this.props.dispatch({
        type: 'conflicts/getPersonInfo',
        payload: { originTextLeft, originTextRight, personListLeft, personListRight, coyear },
      });
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'conflicts/clearConflicts',
    });
  }

  conflicts = () => {
    // TODO 首先获取数据，然后在请求，等人的请求回来以后再发这个
    const { coyear } = queryString.parse(this.props.location.search);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { userNameLeft, userNameRight } = values;
        const personListLeft = userNameLeft ? ConflictsService.stringToJson(userNameLeft) : '';
        const personListRight = userNameRight ? ConflictsService.stringToJson(userNameRight) : '';
        localStorage.setItem('originTextRight', JSON.stringify(userNameRight));
        localStorage.setItem('originTextLeft', JSON.stringify(userNameLeft));
        this.props.dispatch({
          type: 'conflicts/getPersonInfo',
          payload: { userNameLeft, userNameRight, personListLeft, personListRight, coyear },
        });
      }
    });
  };
  showCoauthor = (data) => {
    const { coyear } = queryString.parse(this.props.location.search);
    const { conflicts } = this.props;
    const [personListLeft, personListRight] =
      Maps.getAll(conflicts, 'personListLeft', 'personListRight');
    const isNotNull = (personListLeft && personListLeft.length > 0) &&
      (personListRight && personListRight.length > 0);
    if (data.length === 0 && isNotNull) {
      return (
        <span>未检测出关系</span>
      );
    } else if (data[0] === 'init' && isNotNull) {
      return (
        <span>请等待，正在进行检测。</span>
      );
    } else if ((data.length === 0 || data[0] === 'init') && !isNotNull) {
      return (
        <span>请输入专家信息，并点击检测。</span>
      );
    }
    const relation = data.map((item) => {
      if (item.type === 'coauthor') {
        return (
          <div key={Math.random()}>
            <div className={styles.relaitonResults}>
              <span className={styles.person}>{item.name1}</span>与
              <span className={styles.person}>{item.name2}</span>
              <span>近{coyear}年合作论文数</span>
              <span className={styles.coAuthorCount}>{item.count || 0}</span>
            </div>
          </div>
        );
      } else if (item.type === '学生' || item.type === '老师') {
        return (
          <div key={Math.random()}>
            <div className={styles.relaitonResults}>
              <span className={styles.person}>{item.name1}</span>是
              <span className={styles.person}>{item.name2}</span>的
              <span className={styles.coAuthorCount}>{item.type}</span>
              的概率为
              <span className={styles.coAuthorCount}>
                {item.name1 - item.name2 >= 0 ? '80%' : '78%'}
              </span>
            </div>
          </div>
        );
      } else if (item.type === 'affiliation') {
        return (
          <div key={Math.random()}>
            <div className={styles.relaitonResults}>
              {/*<Tooltip title={`我们找到了多个${item.name1}`} placement="top">*/}
              <span className={styles.person}>{item.name1}</span>
              {/*</Tooltip>*/}
              和
              {/*<Tooltip title={`我们找到了多个${item.name2}`} placement="top">*/}
              <span className={styles.person}>{item.name2}</span>
              {/*</Tooltip>*/}
              <Tooltip title={
                <div>
                  <div><span>{item.name1} :</span>
                    <span>{item.affiliation1}</span>
                  </div>
                  <div>
                    <span>{item.name2} :</span>
                    <span>{item.affiliation2}</span>
                  </div>
                </div>} placement="top">
                在同一单位的概率为
                <span className={styles.coAuthorCount}>{item.similarity}</span>
              </Tooltip>
            </div>
          </div>
        );
      } else {
        return (<span />);
      }
    });
    return relation;
  };
  testData = () => {
    const { dispatch } = this.props;
    const { coyear } = queryString.parse(this.props.location.search);
    const personListLeft = [
      { name: 'jie tang', org: 'tsinghua university' },
      { name: 'Jeff Z Pan', org: '' },
      { name: 'Jiannong Cao', org: 'Department of Computing' }];
    const personListRight = [
      { name: 'juanzi li', org: 'tsinghua university' },
      { name: 'Lizhu Zhou', org: '清华大学计算机科学与技术系' },
      { name: 'Guilin Qi', org: 'School of Computer Science and Engineering' },
      { name: 'Dong-Sheng Li', org: '' }];
    const userNameLeft = 'jie tang,tsinghua university\n' + 'Jeff Z Pan\n' +
      'Jiannong Cao,Department of Computing';
    const userNameRight = 'juanzi li,tsinghua university\n' +
      'Lizhu Zhou,清华大学计算机科学与技术系\n' +
      'Guilin Qi,School of Computer Science and Engineering\n' +
      'Dong-Sheng Li\n';
    this.props.form.setFieldsValue({
      userNameLeft,
      userNameRight,
    });
    dispatch({
      type: 'conflicts/getPersonInfo',
      payload: { userNameLeft, userNameRight, personListLeft, personListRight, coyear },
    });
  };

  render() {
    const { conflicts, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    const relation = conflicts.get('relation');
    const load = loading.effects['conflicts/getPersonInfo', 'conflicts/getRelation'];
    return (
      <Layout searchZone={[]} contentClass={tc(['conflicts'])} showNavigator={true}>
        <div>
          <a onClick={this.testData} className={styles.testData}>测试数据</a>
        </div>
        <div className={styles.nsfcIndexPage}>
          <Form
            className={styles.roughForm}
            onSubmit={this.conflicts}>
            <Col span={10}>
              <FormItem>
                {getFieldDecorator('userNameLeft', {
                  rules: [{ required: true, message: 'Please input your username!' }]
                })(<TextArea
                  autosize={{ minRows: 20, maxRows: 50 }} />)}
              </FormItem>
            </Col>
            <Col span={4}>
              <Button size="large" className={styles.compareBtn} onClick={this.conflicts}>
                检测
              </Button>
            </Col>
            <Col span={10}>
              <FormItem>
                {getFieldDecorator('userNameRight', {
                  rules: [{ required: true, message: 'Please input your username!' }]
                })(<TextArea
                  autosize={{ minRows: 20, maxRows: 50 }} />)}
              </FormItem>
            </Col>
          </Form>
        </div>
        {/*结果*/}
        <div className={styles.showResultsBlock}>
          <Spinner loading={load} />
          {relation &&
          <div className={styles.resultsShow}>
            {this.showCoauthor(relation)}
          </div>}
        </div>
      </Layout>
    );
  }
}

export default connect(({ app, auth, login, loading, conflicts }) => (
  { app, auth, login, loading, conflicts }))(Form.create()(Rough));
