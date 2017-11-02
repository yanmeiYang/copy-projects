/**
 * Created by bogao on 17/11/2.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { LabelLine } from 'components/common';
import { compare } from 'utils/compare';

@connect(({ commonLabels }) => ({ commonLabels }))
export default class Labels extends Component {
  static propTypes = {
    targetId: PropTypes.string,
    targetEntity: PropTypes.string,
  };

  // state = {};

  componentWillMount = () => {
    this.setState({ tags: this.props.tags });
  };

  componentWillReceiveProps = (nextProps) => {
    if (compare(nextProps, this.props, 'tags')) {
      this.setState({ tags: nextProps.tags });
    }
  };

  onTagChange = (op, tag, finalTag) => {
    const { dispatch, targetId, targetEntity } = this.props;
    if (!targetId || !targetEntity) {
      console.error('Must provide property `targetId` and `targetEntity` in component Labels');
    }
    if (op !== 'remove' && op !== 'add') {
      console.error('Invalid op %s', op);
    }
    const payload = { targetEntity, targetId, tag };
    const type = `commonLabels/${op}`;
    console.log('---------------', type);
    dispatch({ type, payload }, (data) => {
      console.log('Retuen data is ', data);
    });
  };

  // handleClose = (removedTag) => {
  //   const tags = this.state.tags.filter(tag => tag !== removedTag);
  //   this.setState({ tags });
  //   this.props.callbackParent(tags);
  // };
  //
  // showInput = () => {
  //   this.setState({ inputVisible: true }, () => this.input.focus());
  // };
  //
  // handleInputChange = (e) => {
  //   this.setState({ inputValue: e.target.value });
  // };
  //
  // handleInputConfirm = () => {
  //   const { inputValue } = this.state;
  //   let tags = this.state.tags;
  //   if (inputValue && tags.indexOf(inputValue) === -1) {
  //     tags = [...tags, inputValue];
  //   }
  //   this.setState({
  //     tags,
  //     inputVisible: false,
  //     inputValue: '',
  //   });
  //   this.props.callbackParent(tags);
  // };
  //
  // saveInputRef = input => this.input = input;

  render() {
    const { tags } = this.state;
    const { commonLabels } = this.props;
    return (
      <LabelLine tags={commonLabels.tags} onTagChange={this.onTagChange} canRemove canAdd />
    );
  }
}
