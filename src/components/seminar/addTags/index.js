/**
 * Created by yangyanmei on 17/6/3.
 */
import React from 'react';
import { Tag, Input, Tooltip, Button } from 'antd';

class AddTags extends React.Component {
  state = {
    tags: [],
    inputVisible: false,
    inputValue: '',
  };
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.tags.length > 0 && this.props.tags.length !== nextProps.tags.length) {
      this.setState({ tags: nextProps.tags });
    }
  }
  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
    this.props.callbackParent(tags);
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
    this.props.callbackParent(tags);
  };

  saveInputRef = input => this.input = input;

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    return (
      <div>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} color="#2db7f5" closable={index !== -1} afterClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {inputVisible && (
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
        {!inputVisible && <Button size="small" type="dashed" onClick={this.showInput}>+ 新标签</Button>}
      </div>
    );
  }
}

export default AddTags;
