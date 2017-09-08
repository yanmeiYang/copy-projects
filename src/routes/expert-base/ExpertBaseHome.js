import React, { Component } from 'react';
import { connect } from 'dva';
import { FormattedMessage as FM } from 'react-intl';
import { Button } from 'antd';
import { routerRedux } from 'dva/router';
import { Spinner } from 'components';
import { classnames } from 'utils';
import { ExpertShow } from 'components/ExpertShow';
import { Auth } from 'hoc';
import styles from './ExpertBaseHome.less';

@connect(({ expertBase }) => ({ expertBase }))
@Auth
export default class ExpertBaseHome extends Component {
  addExpertBase = () => {
    this.props.dispatch(routerRedux.push({ pathname: '/add-expert-base' }));
  };

  render() {
    const { results } = this.props.expertBase;
    return (
      <div className={styles.content}>
        <h1 className={classnames('section_header', styles.header)}>
          <FM id="rcd.home.pageTitle" defaultMessage="Organization List" />
        </h1>
        <div>
          <Spinner nomask />
          {/* TODO 添加i18n */}
          <Button onClick={this.addExpertBase} className={styles.addButton}>添加智库</Button>
          <ExpertShow orgs={results.data} />
        </div>
      </div>
    );
  }
}
