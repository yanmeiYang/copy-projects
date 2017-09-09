/**
 * Created by zlm on 2017/8/31.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Icon, Modal } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { routerRedux } from 'dva/router';
import styles from './AddToEBButton.less';

@connect(({ expertBase }) => ({ expertBase }))
export default class AddToEBButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataIdItem: props.ExpertBase,
      value: 1,
      personData: '',
    };
    const isInThisEB = props.person && props.person.locks && props.person.locks.roster;
    console.log('====================', isInThisEB, props.person.locks);
  }

  // shouldComponentUpdate(nextProps) {
  //   return this.props.person !== nextProps.person;
  // }

  add = (id) => {
    // this.setState({ visible: true });
    // this.props.dispatch({
    //   type: 'expertBase/getExpert',
    //   payload: { offset: 0, size: 20 },
    // });
    const ebid = this.state.dataIdItem;
    const aids = id.split(';');
    this.props.dispatch({
      type: 'expertBase/addExpertToEB',
      payload: { ebid, aids },
    });
    // const personData = this.props.person.id;
    this.setState({ personData: this.props.person.id });
    // console.log('111', this.props);
    // console.log('addStatus是', personData);
  };

  handleOk = (id) => {
    const ebid = this.state.dataIdItem;
    const aids = id.split(';');
    this.props.dispatch({
      type: 'expertBase/addExpertToEB',
      payload: { ebid, aids },
    });

    this.setState({
      visible: false,
    });
    // this.props.dispatch(routerRedux.push({
    //   pathname: `/expert-base-list/${ebid}`,
    // }));
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  selectTitleArea = (id, e) => {
    // this.props.dispatch(routerRedux.push({
    //   pathname: `/expert-base-list/${id}`,
    // }));
    // this.props.dispatch({
    //   type: 'expertBase/getExpertDetailList',
    //   payload: { id, offset: 0, size: 20 },
    // });
    this.setState({
      value: e.target.value,
    });
    this.setState({ dataIdItem: id });
  };

  render() {
    const per = this.props.person;
    const { results } = this.props.expertBase;
    const orgData = results.data;
    return (
      <div className={styles.buttonArea}>
        <Button onClick={this.add.bind(this, per.id)}>
          {this.state.personData // TODO: Default message should be english.
            ? <FM id="com.bole.AddedSuccessfully" defaultMessage="添加成功" />
            : <FM id="com.bole.AddButton" defaultMessage="添加" />
          }
        </Button>

        <Modal title="智库列表"
               visible={this.state.visible}
               onCancel={this.handleCancel}
               onOk={this.handleOk.bind(this, per.id)}>
          {
            orgData && orgData.map((org) => {
              return (
                <div className={styles.selectTitle} key={org.id}
                     onClick={this.selectTitleArea.bind(this, org.id)}>
                  {org.title}
                </div>
              );
            })
          }
        </Modal>
      </div>
    );
  }
}
