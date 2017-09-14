/* eslint-disable import/no-dynamic-require */
/**
 * Created by bogao on 2017/09/13.
 */
import React, { PureComponent, Component, PropTypes } from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { Layout as LayoutComponent } from 'antd';
import { sysconfig, applyTheme } from 'systems';
import { Header } from 'components/Layout';
import styles from './Layout.less';

const { Sider, Content, Footer } = LayoutComponent;

const { theme } = sysconfig;
const tc = applyTheme(styles);

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
    // Header
    logoZone: PropTypes.array,
    searchZone: PropTypes.array,
    infoZone: PropTypes.array,

    contentClass: PropTypes.string,

    showHeader: PropTypes.bool,
    footer: PropTypes.element,
  };

  static defaultProps = {
    showHeader: true,
    footer: theme.footer,
  };

  componentWillReceiveProps = (nextProps) => {
  };

  render() {
    const { logoZone, searchZone, infoZone, footer } = this.props;
    const { contentClass, showHeader } = this.props;

    const headerOptions = { logoZone, searchZone, infoZone };

    return (
      <LayoutComponent className={tc(['layout'])}>

        {showHeader && <Header {...headerOptions} />}

        <LayoutComponent>

          {/* -------- Left Side Bar -------- */}
          {sysconfig.Layout_HasSideBar &&
          <Sider className={tc(['sider'])}>
            <span className={tc(['text'])}>left sidebar</span>
          </Sider>
          }

          <Content className={tc(['content'], [contentClass])}>
            {this.props.children}
          </Content>

          {/*<Sider>right sidebar</Sider>*/}
        </LayoutComponent>

        {/* -------- Footer -------- */}
        <Footer className={tc(['footer'])}>
          {footer}
        </Footer>

      </LayoutComponent>
    );
  }
}
