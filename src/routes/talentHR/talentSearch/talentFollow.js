import React, { Component } from 'react';
import { Menu, Dropdown, Button, Icon, message, Checkbox } from 'antd';
import { compareDeep, compare } from 'utils/compare';
import styles from './talentFollow.less'
import { connect } from "dva";
import { Form } from "antd/lib/index";

const CheckboxGroup = Checkbox.Group;

class TalentFollow extends Component {
  state = {
    visible: false,
    values: [],
  };
  // componentWillMount(){
  // };

  componentWillReceiveProps = (nextProps) => {
    // if (compareDeep(nextProps, this.props, 'follow')) {
    //   this.setState({ follow: nextProps.follow });
    // }
    // if (compare(nextProps, this.props, 'loading')) {
    //   this.setState({ inputVisible: nextProps.loading });
    // } else if (nextProps.loading === this.props.loading && this.props.loading === false) {
    //   this.setState({ inputVisible: nextProps.loading });
    // }
  };

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  };
  onChange = (e) => {
    console.log('qqqqqqqqq', e);
    console.log('test', this.props.person);
    this.setState({ values: e })
  };

  render() {
    const plainOptions = ['1', '2', '3', '4'];
    const menu = (
      <Menu>
        <Menu.Item key="1">
          <CheckboxGroup options={plainOptions} className={styles.checkBox}
                         value={this.state.values}
                         onChange={this.onChange} />
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu} visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}>
        <Button style={{ marginLeft: 8 }} type="primary">
          <Icon type="user-add" />follow
        </Button>
      </Dropdown>
    )
  }
}

const mapStateToProps = ({ app, personComments, commonFollow }, { person }) => ({
  personComments,
  app: {
    user: app.user,
    roles: app.roles,
  },
  tags: commonFollow.followMap && person && commonFollow.followMap.get(person.id),
});
export default connect(mapStateToProps)(Form.create()(TalentFollow));
