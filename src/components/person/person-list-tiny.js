/**
 *  Created by BoGao on 2017-07-20;
 */
import React from 'react';
import { classnames } from 'utils';
import PersonList from './person-list';
import styles from './person-list-tiny.less';

/**
 * @param param
 *
 */
class PersonListTiny extends React.PureComponent {
  render() {
    console.log('refresh person-tiny list ');

    return (
      <PersonList
        className={classnames(this.props.className, styles.tinyModified)}
        persons={this.props.persons}
        expertBaseId={this.props.expertBaseId}
        titleRightBlock={this.props.titleRightBlock}
        rightZoneFuncs={this.props.rightZoneFuncs}
        didMountHooks={this.props.didMountHooks}
        UpdateHooks={this.props.UpdateHooks}
      />
    );

  }
}

export default PersonListTiny;
