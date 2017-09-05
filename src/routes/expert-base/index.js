import React from 'react';
import { connect } from 'dva';
import { FormattedMessage as FM } from 'react-intl';
import { Button } from 'antd';
import { routerRedux } from 'dva/router';
import { Spinner } from '../../components';
import { classnames } from '../../utils';
import styles from './index.less';
import { ExpertShow } from '../../components/ExpertShow';

class ExpertBase extends React.Component {
  addExpertBase = () => {
    this.props.dispatch(routerRedux.push({ pathname: '/add-expert-base' }));
  };

  render() {
    const { results } = this.props.expertBase;
    return (
      <div className={styles.content}>
        <h1 className={classnames('section_header', styles.header)}>
          <FM id="rcd.home.pageTitle" defaultMessage="Organization List"/>
        </h1>
        <div>
          <Spinner nomask/>
          <Button onClick={this.addExpertBase} className={styles.addButton}>添加智库</Button>
          <ExpertShow orgs={results.data} />
        </div>{/**/}
      </div>
    );
  }
}

export default connect(({ expertBase }) => ({ expertBase }))(ExpertBase);
