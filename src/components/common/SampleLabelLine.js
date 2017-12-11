/**
 * Created by yangyanmei on 17/6/3.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag, Input, Tooltip, Button } from 'antd';
import { compareDeep, compare } from 'utils/compare';

export default class SampleLabelLine extends Component {
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
  };

  componentWillMount = () => {
    console.log('componentWillMount=========', this.props.tags);
    this.setState({ tags: this.props.tags });
  };

  componentWillReceiveProps = (nextProps) => {
    if (compareDeep(nextProps, this.props, 'tags')) {
      this.setState({ tags: nextProps.tags });
    }
  };

  handleClose = (removedTag, e) => {
    e.preventDefault();
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
    if (this.props.onTagChange) {
      this.props.onTagChange(tags);
    }
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputConfirm = (e) => {
    const newTag = e.target.value;
    const { tags } = this.state;
    let newTags = tags || [];
    if (newTag && newTags.indexOf(newTag) === -1) {
      newTags = [...newTags, newTag];
    }
    this.setState({
      tags: newTags,
      inputVisible: false,
    });
    if (this.props.onTagChange) {
      this.props.onTagChange(newTags);
    }
  };

  saveInputRef = (input) => {
    this.input = input;
  };

  render() {
    const { tags, inputVisible } = this.state;
    const { canRemove, canAdd } = this.props;
    // console.log(' -- sample label render ------', tags);
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
