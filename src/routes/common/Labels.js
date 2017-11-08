/**
 * Created by bogao on 17/11/2.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { message, Modal } from 'antd';
import { connect } from 'dva';
import { LabelLine } from 'components/common';
import { compare } from 'utils/compare';

@connect(({ commonLabels, loading }) => ({ commonLabels, loading }))
export default class Labels extends Component {
  static propTypes = {
    targetId: PropTypes.string,
    targetEntity: PropTypes.string,
  };

  state = {
    tags: [],
  };

  componentWillMount = () => {
    this.setState({ tags: this.props.tags });
  };

  componentWillReceiveProps = (nextProps) => {
    // tags from outside.
    if (compare(nextProps, this.props, 'tags')) {
      this.setState({ tags: nextProps.tags });
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    // if (compare(
    //     this.props, nextProps,
    //   )) {
    //   return true;
    // }
    return true;
  }

  onTagChange = (op, tag) => {
    const { dispatch, targetId, targetEntity } = this.props;
    if (!targetId || !targetEntity) {
      console.error('Must provide property `targetId` and `targetEntity` in component Labels');
    }
    if (op !== 'remove' && op !== 'add') {
      console.error('Invalid op %s', op);
    }

    const payload = { targetEntity, targetId, tag };
    const type = `commonLabels/${op}`;
    const { tags } = this.state;

    if (op === 'remove') {
      const that = this;
      Modal.confirm({
        title: '删除',
        content: '确定删除吗？',
        onOk() {
          dispatch({ type, payload })
            .then((success) => {
              if (success) {
                const newTags = tags || [];
                if (newTags.indexOf(tag) !== -1) {
                  that.setState({ tags: tags.filter(t => t !== tag) });
                }
              } else {
                message.error('删除标签错误');
              }
            });
        },
        onCancel() {
        },
      });
    } else {
      dispatch({ type, payload })
        .then((success) => {
          if (success) {
            const newTags = tags || [];
            if (newTags.indexOf(tag) === -1) {
              this.setState({ tags: [...newTags, tag] });
            }
          } else {
            message.error('添加标签错误');
          }
        });
    }
  };

  render() {
    const { tags } = this.state;
    const load = this.props.loading.effects['commonLabels/add'];
    // const { commonLabels } = this.props;
    return (
      <LabelLine tags={tags} loading={load} onTagChange={this.onTagChange} canRemove canAdd
                 confirmOnClose />
    );
  }
}
