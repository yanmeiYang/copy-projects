/**
 * Created by zlm on 2017/8/31.
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Icon, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './person-right-button.less';


class PersonRightButton extends React.PureComponent {
  state = {
    visible: false,
    dataIdItem: '',
    value: 1,
    };
  // shouldComponentUpdate(nextProps) {
  //   return this.props.person !== nextProps.person;
  // }
  add = (per) => {
    this.setState({ visible: true });
    this.props.dispatch({
      type: 'expertBase/getExpert',
      payload: { offset: 0, size: 20 },
    });
  };
  handleOk = (id) => {
    const ebid = this.state.dataIdItem;
    const aids = id.split(';');
    this.props.dispatch({
      type: 'expertBase/addExpertDetail',
      payload: { ebid, aids },
    });

    this.setState({
      visible: false,
    });
    this.props.dispatch(routerRedux.push({
      pathname: `/expert-base-list/${ebid}`,
    }));
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
        <Button onClick={this.add.bind(this, per)}>
          <Icon type="plus"></Icon>
          add
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

export default connect(({ expertBase }) => ({ expertBase }))(PersonRightButton);
