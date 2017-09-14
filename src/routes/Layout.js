/* eslint-disable import/no-dynamic-require */
/**
 * Created by bogao on 2017/09/13.
 */
import React, { PureComponent, Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Layout as LayoutComponent } from 'antd';
import { sysconfig, applyTheme } from 'systems';
import { Header, Navigator } from 'components/Layout';
import styles from './Layout.less';

const { Sider, Content, Footer } = LayoutComponent;

const { theme } = sysconfig;
const tc = applyTheme(styles);

@connect(({ app }) => ({ app }))
export default class Layout extends Component {
  static displayName = 'Layout';

  static propTypes = {
    // Header
    logoZone: PropTypes.array,
    searchZone: PropTypes.array,
    infoZone: PropTypes.array,

    navigator: PropTypes.element,
    footer: PropTypes.element,

    contentClass: PropTypes.string,
    showHeader: PropTypes.bool,
    showNavigator: PropTypes.bool,
  };

  static defaultProps = {
    showHeader: true,
    showNavigator: true,
    footer: theme.footer,
  };

  render() {
    const { logoZone, searchZone, infoZone, navigator, footer } = this.props;
    const { contentClass, showHeader, showNavigator } = this.props;

    const headerOptions = { logoZone, searchZone, infoZone };
    const navigatorOptions = { navigator };

    return (
      <LayoutComponent className={tc(['layout'])}>

        {showHeader && <Header {...headerOptions} />}
        {showNavigator && <Navigator {...navigatorOptions} />}

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
