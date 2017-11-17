import React, { Component, PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage as FM } from 'react-intl';
import { Button, Card } from 'antd';
import { routerRedux, Link } from 'dva/router';
import { Spinner } from 'components';
import { Layout } from 'routes';
import { applyTheme } from 'themes';
import { classnames } from 'utils';
import { sysconfig } from 'systems';
import { ExpertShow } from 'components/ExpertShow';
import { Auth } from 'hoc';
import styles from './ExpertBaseHome.less';

const tc = applyTheme(styles);
@connect(({ app, expertBase }) => ({ app, expertBase }))
@Auth
export default class ExpertBaseHome extends PureComponent {
  addExpertBase = () => {
    this.props.dispatch(routerRedux.push({ pathname: '/add-expert-base' }));
  };

  render() {
    const { results } = this.props.expertBase;
    return (
      <Layout contentClass={tc(['expertBaseHome'])}>
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

          <div className={styles.expertBaseList}>
            {sysconfig.MyExpert_List && sysconfig.MyExpert_List.map((item) => {
              return <Card key={item.id} className={styles.expertBaseItem}>
                <Link href={`/eb/${item.id}/-/0/20`} to={`/eb/${item.id}/-/0/20`}>
                  {item.title}
                </Link>
              </Card>;
            })}
          </div>
        </div>
      </Layout>
    );
  }
}
