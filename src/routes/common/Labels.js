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
    const { tags } = this.state;
    dispatch({ type, payload })
      .then((success) => {
        if (success) {
          if (op === 'add') {
            const newTags = tags || [];
            if (newTags.indexOf(tag) === -1) {
              this.setState({ tags: [...newTags, tag] });
            }
          } else if (op === 'remove') {
            console.log('remove this tags',);
            // TODO /......
          }
        }
      });
  };

  render() {
    const { tags } = this.state;
    // const { commonLabels } = this.props;
    return (
      <LabelLine tags={tags} onTagChange={this.onTagChange} canRemove canAdd />
    );
  }
}
