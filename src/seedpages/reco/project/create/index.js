import React, { Component } from 'react';
import { connect, Link } from 'engine';
import { Layout } from 'components/layout';
import { classnames } from 'utils';
import { Steps, Button, message, Input, Modal } from 'antd';
import CreateProject from '../../components/CreateProject';
import styles from './$id.less';

const { Step } = Steps;
const { TextArea } = Input;
const steps = [{
  title: '基本信息',
  content: <CreateProject />,
}, {
  title: '邮件模板',
  content: <CreateProject />,
}, {
  title: '群发',
  content: <div className={styles.content}><h3>请仔细阅读一下内容</h3>
    <p>点击群发按钮后，我们会将您的期刊推送到用户的邮箱内，请您在测试通过的情况下点击群发按钮，
      感谢您的使用，您可在列表页查看推送报告!
    </p>
    <Button onClick={this.sendAll} type="primary">群发</Button>
  </div>,
}];
@connect(({ reco }) => ({ reco }))
export default class SendTest extends Component {
  state = {
    current: 0,
    email: '',
  };
// 保存测试邮件地址
  saveEmail = (e) => {
    this.setState({ email: e.target.value });
  };
  //  发送邮件
  sendEmail = () => {
    const { email } = this.state;
    const { id } = this.props.match.params;
    const that = this;
    this.props.dispatch({
      type: 'reco/sendTestEmail',
      payload: {
        ids: [id],
        emails: email,
      },
    }).then((data) => {
      if (data.succeed) {
        Modal.success({
          title: '发送结果',
          content: '发送成功',
          okText: '下一步',
          onOk() {
            that.next();
          },
        });
      } else {
        Modal.success({
          title: '发送结果',
          content: `${data.error}`,
        });
      }
    });
  };
  // 查看测试结果
  sendConfirm = () => {
    const { id } = this.props.match.params;
    this.props.dispatch({
      type: 'reco/sendConfirm',
      payload: {
        ids: [id],
        opts: [],
      },
    }).then((data) => {
      if (data.succeed) {
        Modal.success({
          title: '测试结果',
          content: '测试成功',
        });
      } else {
        Modal.error({
          title: '测试结果',
          content: `${data.error}`,
        });
      }
    });
  };
  // TODO @xiaobei： 群发事件，必须有emaillist，暂时只能人工筛选后粘贴进来！
  sendAll = () => {
    const { id } = this.props.match.params;
    this.props.dispatch({
      type: 'reco/sendEmail',
      payload: {
        ids: [id],
        opts: [],
      },
    }).then((data) => {
      if (data.succeed) {
        Modal.success({
          title: '群发结果',
          content: '群发成功',
        });
      } else {
        Modal.error({
          title: '测试结果',
          content: `${data.error}`,
        });
      }
    });
  };
  next = () => {
    const current = this.state.current + 1;
    this.setState({ current });
  };

  prev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
  };

  render() {
    const { current } = this.state;

    return (
      <Layout searchZone={[]} showNavigator={false}>
        <Link to="/"><Button>返回列表</Button></Link>
        <div className={styles.sendtest}>
          <Steps current={current} size="default">
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
          <div
            className={classnames(styles.stepscontent, 'steps-content')}>
            {steps[this.state.current].content}
          </div>
          <div className={classnames(styles.stepsaction, 'step-action')}>
            {
              this.state.current < steps.length - 1
              &&
              <Button type="primary" onClick={() => this.next()}>下一步</Button>
            }
            {
              this.state.current === steps.length - 1
              &&
              <Button type="primary">完成</Button>
            }
            {
              this.state.current > 0
              &&
              <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                上一步
              </Button>
            }
          </div>
        </div>
      </Layout>
    );
  }
}
