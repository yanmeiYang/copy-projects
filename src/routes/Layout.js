/* eslint-disable import/no-dynamic-require */
/**
 * Created by bogao on 2017/09/13.
 */
import React, { PureComponent, Component } from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { Layout as ALayout } from 'antd';
import { sysconfig } from 'systems';
import styles from './Layout.less';

const { Header, Sider, Content, Footer } = ALayout;
// import { Menu, Icon, Dropdown } from 'antd';
// import { Link } from 'dva/router';
// import { FormattedMessage as FM } from 'react-intl';
// import { isEqual } from 'lodash';
// import * as profileUtils from '../../utils/profile-utils';
// import { sysconfig } from '../../systems';
// import { KgSearchBox, SearchTypeWidgets } from '../../components/search';
// import { isLogin, isGod, isAuthed } from '../../utils/auth';
// import { TobButton, DevMenu } from '../../components/2b';
// import locales from '../../locales';
// import { saveLocale } from '../../utils/locale';
// import defaults from '../../systems/utils';

console.log('styles:::layout is ', styles);
console.log('styles:::', sysconfig.theme);

@connect(({ app }) => ({ app }))
export default class Layout extends Component {
  static displayName = 'Layout';

  static propTypes = {
    // sorts: PropTypes.array,
    // sortType: PropTypes.string.isRequired,
    // rightZone: PropTypes.array,
    // onOrderChange: PropTypes.func,
  };

  static defaultProps = {
    // sortType: 'relevance',
    // rightZone: [],
  };

  componentWillReceiveProps = (nextProps) => {
  };

  render() {
    const theme = sysconfig.theme.theme;
    return (
      <ALayout className={classnames(styles.layout, theme.layout)}>
        <Header>
          <span className={styles.text}> header</span>
        </Header>
        <ALayout>
          <Sider className={styles.sider}>
            <span className={styles.text}>left sidebar</span>
          </Sider>
          <Content>{this.props.children}</Content>
          <Sider>right sidebar</Sider>
        </ALayout>
        <Footer>footer</Footer>
      </ALayout>
    );
  }
}
