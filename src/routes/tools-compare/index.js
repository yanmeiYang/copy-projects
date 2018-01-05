import React from 'react';
import { Button, Row, Col, Input, Form, Menu, Dropdown, Icon } from 'antd';
import { Layout } from 'routes';

class ComparePage extends React.Component {
  state = {
    isClicked: false,
    leftInputList: '',
    rightInputList: '',
    leftUnmatchedList: '',
    rightUnmatchedList: '',
    matchedList: '',
    confusingList: '',
    mode: 'default',//['default' | 'tab' | 'coma' | 'special' ]
  };
  onClicked = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.state.leftInputList = values;
      }
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        this.setState({
          leftInputList: values.leftInput,
          rightInputList: values.rightInput,
        }, () => {
          if (this.state.mode === 'default') {
            let leftArray = this.state.leftInputList.split('\n');
            // const leftArray2 = this.state.leftInputList.toLowerCase().split('\n');
            let rightArray = this.state.rightInputList.split('\n');
            //  const rightArray2 = this.state.rightInputList.toLowerCase().split('\n');
            const leftOrigins = new Map();
            const leftCandidates = new Map();
            const rightOrigins = new Map();
            const rightCandidates = new Map();
            const leftUnmatched = [];
            const rightUnmatched = [];
            const rightUnmatched2 = [];
            const matched = [];
            const confusing = [];
            leftArray = Array.from(new Set(leftArray));
            rightArray = Array.from(new Set(rightArray));
            for (let i = 0; i < leftArray.length; i++) {
              if (leftArray[i] !== '') {
                leftArray[i] = {
                  name: leftArray[i],
                  origin: leftArray[i].toLowerCase().trim(),
                  candidates: this.createCandidates(leftArray[i].toLowerCase().trim()),
                };
                leftOrigins.set(leftArray[i].origin, i);
                leftCandidates.set(leftArray[i].origin, i);
                for (let j = 0; j < leftArray[i].candidates.length; j++) {
                  leftCandidates.set(leftArray[i].candidates[j], i);
                }
              }
            }
            for (let i = 0; i < rightArray.length; i++) {
              if (rightArray[i] !== '') {
                rightArray[i] = {
                  name: rightArray[i],
                  origin: rightArray[i].toLowerCase().trim(),
                  candidates: this.createCandidates(rightArray[i].toLowerCase().trim()),
                };
                rightUnmatched.push(rightArray[i].name);
                rightUnmatched2.push(rightArray[i].origin);
                rightOrigins.set(rightArray[i].origin, i);
                rightCandidates.set(rightArray[i].origin, i);
                for (let j = 0; j < rightArray[i].candidates.length; j++) {
                  rightCandidates.set(rightArray[i].candidates[j], i);
                }
              }
            }
            for (let i = 0; i < leftArray.length; i++) {
              if (rightOrigins.has(leftArray[i].origin)) {
                matched.push(leftArray[i].name);
                let tmpIndex = rightUnmatched.indexOf(leftArray[i].name);
                if (tmpIndex >= 0) {
                  rightUnmatched.splice(tmpIndex, 1);
                  rightUnmatched2.splice(tmpIndex, 1);
                  leftArray[i].candidates.map(x => {
                    tmpIndex = rightUnmatched2.indexOf(x);
                    if (tmpIndex >= 0) {
                      confusing.push(leftArray[i].name + ' <=> ' + rightUnmatched[tmpIndex]);
                      rightUnmatched.splice(tmpIndex, 1);
                      rightUnmatched2.splice(tmpIndex, 1);
                    }
                    return x;
                  });
                }
              } else {
                let isFound = false;
                for (let j = 0; j < leftArray[i].candidates.length; j++) {
                  const candidate = leftArray[i].candidates[j];
                  const tmpIndex2 = rightCandidates.get(candidate);
                  if (tmpIndex2 !== undefined) {
                    confusing.push(leftArray[i].name + ' <=> ' + rightArray[tmpIndex2].name);
                    let tmpIndex3 = rightUnmatched.indexOf(rightArray[tmpIndex2].name);
                    if (tmpIndex3 >= 0) {
                      rightUnmatched.splice(tmpIndex3, 1);
                      rightUnmatched2.splice(tmpIndex3, 1);
                    }
                    leftArray[i].candidates.map(x => {
                      tmpIndex3 = rightUnmatched2.indexOf(x);
                      if (tmpIndex3 >= 0) {
                        confusing.push(leftArray[i].name + ' <=> ' + rightUnmatched[tmpIndex3]);
                        rightUnmatched.splice(tmpIndex3, 1);
                        rightUnmatched2.splice(tmpIndex3, 1);
                      }
                      return x;
                    });
                    rightArray[tmpIndex2].candidates.map(x => {
                      tmpIndex3 = rightUnmatched2.indexOf(x);
                      if (tmpIndex3 >= 0) {
                        confusing.push(leftArray[i].name + ' <=> ' + rightUnmatched[tmpIndex3]);
                        rightUnmatched.splice(tmpIndex3, 1);
                        rightUnmatched2.splice(tmpIndex3, 1);
                      }
                      return x;
                    });
                    isFound = true;
                    break;
                  }
                }
                if (!isFound) {
                  leftUnmatched.push(leftArray[i].name);
                }
              }
            }
            this.setState({
              leftUnmatchedList: leftUnmatched.join('\n'),
              rightUnmatchedList: rightUnmatched.join('\n'),
              matchedList: matched.join('\n'),
              confusingList: confusing.join('\n'),
              isClicked: true,
            });
          } else {
            const leftArray = this.state.leftInputList.split('\n');
            // const leftArray2 = this.state.leftInputList.toLowerCase().split('\n');
            const rightArray = this.state.rightInputList.split('\n');
            //  const rightArray2 = this.state.rightInputList.toLowerCase().split('\n');
            const matchedIds = [];
            let interval = ',';
            if (this.state.mode === 'tab') {
              interval = '\t';
            }
            const leftIds = leftArray.map((row) => {
              const items = row.split(interval);
              return items[0].trim();
            });
            const rightIds = rightArray.map((row) => {
              const items = row.split(interval);
              return items[0].trim();
            });
            for (let i = 0; i < leftIds.length; i++) {
              const index = rightIds.indexOf(leftIds[i]);
              if (index > -1) {
                matchedIds.push(`${leftArray[i]} <=> ${rightArray[index]}`);
                leftIds.splice(i, 1);
                leftArray.splice(i, 1);
                rightIds.splice(index, 1);
                rightArray.splice(index, 1);
                i--;
              }
            }
            this.setState({
              leftUnmatchedList: leftArray.join('\n'),
              rightUnmatchedList: rightArray.join('\n'),
              matchedList: matchedIds.join('\n'),
              confusingList: '',
              isClicked: true,
            });
          }
        });
      }
    });
  };
  //生成候选名单
  createCandidates = (x) => {
    const tmp = x;
    const outcome = [];
    outcome.push(tmp);
    let tmp2 = x.split(' ');
    //对于带.名字的特殊处理
    if (tmp.includes('.')) {
      for (let i = 0; i < tmp2.length; i++) {
        if (tmp2[i].includes('.')) {
          tmp2.splice(i, 1);
          const tmp9 = tmp2.join(' ');
          outcome.push(tmp9);
          i--;
        }
      }
      //对于带‘-’名字的特殊处理
    } else if (x.includes('-')) {
      if (tmp2.length === 2) {
        const tmp3 = tmp2.join('');
        const tmp4 = tmp2.reverse().join(' ');
        const tmp5 = tmp2.join('');
        outcome.push(tmp3, tmp4, tmp5);
        tmp2.reverse();
        tmp2 = tmp.split('-').join('').split(' ');
      }
    }
    //对于两个单词的名字的特殊处理
    if (tmp2.length === 2) {
      const tmp6 = tmp2.join('');
      const tmp7 = tmp2.reverse().join(' ');
      const tmp8 = tmp2.join('');
      outcome.push(tmp6, tmp7, tmp8);
    }
    return outcome;
  };
  changeMode = (data) => {
    this.setState({ mode: data.key });
    //console.log('mode:', this.state.mode);
  };

  render() {
    const FormItem = Form.Item;
    const { getFieldDecorator } = this.props.form;
    const menu = (
      <Menu onClick={this.changeMode}>
        <Menu.Item key="default">完整比较</Menu.Item>
        <Menu.Item key="coma">id比较（coma）</Menu.Item>
        <Menu.Item key="tab">id比较（tab）</Menu.Item>
      </Menu>
    );
    return (
      <Layout searchZone={[]} showNavigator={false}>
        <div>
          <h1>请输入需要比较的文本</h1>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button style={{ marginLeft: 8 }}>
              {this.state.mode}
              <Icon type="down" />
            </Button>
          </Dropdown>
          <Form onSubmit={this.onClicked}>
            <Row>
              <Col span={12}>需要对比的文本a
                <FormItem>
                  {getFieldDecorator('leftInput', { rules: [{ required: true }] })(
                    <Input.TextArea type="text" autosize={{ minRows: 15, maxRows: 15 }} />)}
                </FormItem>
              </Col>
              <Col span={12}>需要对比的文本b
                <FormItem>
                  {getFieldDecorator('rightInput', { rules: [{ required: true }] })(
                    <Input.TextArea type="text" autosize={{ minRows: 15, maxRows: 15 }} />)}
                </FormItem>
              </Col>
            </Row>
            <FormItem>
              <Button onClick={this.onClicked} size="large" type="primary">
                开始比较
              </Button>
            </FormItem>
          </Form>
          {this.state.isClicked &&
          <Row>
            <Col span={6}>左侧文本独有内容
              <Input.TextArea value={this.state.leftUnmatchedList}
                              autosize={{ minRows: 15, maxRows: 15 }} />
            </Col>
            <Col span={6}>右侧文本独有内容
              <Input.TextArea value={this.state.rightUnmatchedList}
                              autosize={{ minRows: 15, maxRows: 15 }} />
            </Col>
            <Col span={6}>两侧文本相同内容
              <Input.TextArea wrap="off" value={this.state.matchedList}
                              autosize={{ minRows: 15, maxRows: 15 }} />
            </Col>
            <Col span={6}>可能相关的内容
              <Input.TextArea value={this.state.confusingList}
                              autosize={{ minRows: 15, maxRows: 15 }} />
            </Col>
          </Row>}
        </div>
      </Layout>
    );
  }
}

export default Form.create()(ComparePage);
