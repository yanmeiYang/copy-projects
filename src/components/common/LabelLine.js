/**
 * Created by yangyanmei on 17/6/3.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag, Input, Tooltip, Button } from 'antd';
import { compare } from 'utils/compare';

const op = { REMOVE: 'remove', ADD: 'add', UPDATE: 'update' };

export default class LabelLine extends Component {
  static propTypes = {
    onTagChange: PropTypes.func,
    canRemove: PropTypes.bool,
    canAdd: PropTypes.bool,
  };

  static defaultProps = {
    canRemove: false,
    canAdd: false,
  };

  state = {
    tags: [],
    inputVisible: false,
    inputValue: '',
  };

  componentWillMount = () => {
    this.setState({ tags: this.props.tags });
  };

  componentWillReceiveProps = (nextProps) => {
    if (compare(nextProps, this.props, 'tags')) {
      this.setState({ tags: nextProps.tags });
    }
  };

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
    if (this.props.onTagChange) {
      this.props.onTagChange(op.REMOVE, removedTag, tags);
    }
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue, tags } = this.state;
    let newTags;
    if (inputValue && tags && tags.indexOf(inputValue) === -1) {
      newTags = [...tags, inputValue];
    }
    this.setState({
      tags: newTags,
      inputVisible: false,
      inputValue: '',
    });
    if (this.props.onTagChange) {
      this.props.onTagChange(op.ADD, inputValue, newTags);
    }
  };

  saveInputRef = input => this.input = input;

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    const { canRemove, canAdd } = this.props;

    return (
      <div>
        {tags && tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const closable = canRemove && index !== -1;
          // TODO 使用 css 来显示...
          const tagElem = (
            <Tag key={tag} color="#2db7f5" closable={closable}
                 afterClose={this.handleClose.bind(this, tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {canAdd && inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {canAdd && !inputVisible &&
        <Button size="small" type="dashed" onClick={this.showInput}>+ 新标签</Button>}
      </div>
    );
  }
}
