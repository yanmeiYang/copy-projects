/**
 * Created by yangyanmei on 17/6/3.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tag, Input, Tooltip, Button } from 'antd';
import { LabelLine } from 'components/common';
import { compare } from 'utils/compare';

@connect(({ commonLabels }) => ({ commonLabels }))
export default class Labels extends Component {

  // state = {};

  componentWillMount = () => {
    this.setState({ tags: this.props.tags });
  };

  componentWillReceiveProps = (nextProps) => {
    if (compare(nextProps, this.props, 'tags')) {
      this.setState({ tags: nextProps.tags });
    }
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
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <LabelLine tags={tags} callbackParent={this.onTagsChanged} />
    );
  }
}
