/**
 * Created by yangyanmei on 17/6/3.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag, Input, Tooltip, Button } from 'antd';
import { compareDeep, compare } from 'utils/compare';

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
    inputDisabled: false,
  };

  componentWillMount = () => {
    this.setState({ tags: this.props.tags });
  };

  componentWillReceiveProps = (nextProps) => {
    if (compareDeep(nextProps, this.props, 'tags')) {
      this.setState({ tags: nextProps.tags });
    }
    console.log('-----------',nextProps.loading, this.props.loading );
    if (compare(nextProps, this.props, 'loading')) {
      this.setState({ inputVisible: nextProps.loading });
    } else if (nextProps.loading === this.props.loading && this.props.loading === false) {
      this.setState({ inputVisible: nextProps.loading });
    }
  };

  handleClose = (removedTag, e) => {
    e.preventDefault();
    // const tags = this.state.tags.filter(tag => tag !== removedTag);
    if (this.props.onTagChange) {
      this.props.onTagChange(op.REMOVE, removedTag);
    }
  };

  showInput = () => {
    this.setState({ inputVisible: true, inputDisabled: false }, () => this.input.focus());
  };

  handleInputConfirm = (e) => {
    const newTag = e.target.value;
    if (newTag !== '' && newTag) {
      this.setState({
        inputDisabled: true,
      });
      if (this.props.onTagChange) {
        this.props.onTagChange(op.ADD, newTag);
      }
    }
  };

  saveInputRef = (input) => {
    this.input = input;
  };

  render() {
    const { tags, inputVisible, inputDisabled } = this.state;
    const { canRemove, canAdd } = this.props;
    return (
      <div>
        {tags && tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const closable = canRemove && index !== -1;
          // TODO 使用 css 来显示...
          const tagElem = (
            <Tag key={tag} color="#2db7f5" closable={closable}
                 onClose={this.handleClose.bind(this, tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? <Tooltip key={tag} title={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {canAdd && inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            disabled={inputDisabled}
            style={{ width: 78 }}
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
