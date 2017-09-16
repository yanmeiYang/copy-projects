/**
 * Created by BoGao on 2017/9/14.
 */
import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'dva';
import { sysconfig, applyTheme } from 'systems';
import { Layout } from 'antd';
import { KgSearchBox } from 'components/search';
import HeaderInfoZone from 'components/Layout/HeaderInfoZone';
import styles from './Header.less';

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

@connect(({ app }) => ({ app }))
export default class Header extends PureComponent {
  static displayName = 'Header';

  static propTypes = {
    logoZone: PropTypes.array,
    searchZone: PropTypes.array,
    infoZone: PropTypes.array,

    query: PropTypes.string,
    onSearch: PropTypes.func,

    headerSearchBox: PropTypes.object,
  };

  static defaultProps = {
    logoZone: theme.logoZone,
    searchZone: theme.searchZone,
    infoZone: theme.infoZone,
  };

  state = {
    // query: '',
    // logoutLoading: false,
  };

  componentWillReceiveProps = (nextProps) => {
    // console.log('>>>>>>>>>>>>>>>>> ', nextProps.app.headerSearchBox);
    if (nextProps.app.headerSearchBox) {
      // console.log('>>>>>>>>>>>>>>>>> ', nextProps.app.headerSearchBox.query);
      // console.log('>>>>>>>>>>>>>>>>> ', nextProps.app.headerSearchBox !== this.props.app.headerSearchBox);
      if (nextProps.app.headerSearchBox !== this.props.app.headerSearchBox
        || this.props.app.headerSearchBox.query !== this.state.query) {
        // if (nextProps.app.headerSearchBox.query) {
        this.setQuery(nextProps.app.headerSearchBox.query);
        // }
      }
    }
  };

  // onChangeLocale = (locale) => {
  //   saveLocale(sysconfig.SYSTEM, locale);
  //   window.location.reload();
  // };
  //
  setQuery = (query) => {
    this.setState({ query });
  };
  //
  // logoutAuth = () => {
  //   this.setState({ logoutLoading: true });
  //   // this.forceUpdate(() => console.log('forceUpdate Done!'));
  //   this.props.logout();
  //   // this.setState({ logoutLoading: false });
  // };
  //
  // loginPageUrl = () => {
  //   return location.pathname !== sysconfig.Auth_LoginPage
  //     ? `/login?from=${location.pathname}`
  //     : '/login';
  // };

  render() {
    const { logoZone, searchZone, infoZone } = this.props;
    const { headerSearchBox } = this.props.app;
    console.log('>>>>>>>', logoZone, searchZone, infoZone);

    if (headerSearchBox) {
      const oldSearchHandler = headerSearchBox.onSearch;
      headerSearchBox.onSearch = (query) => {
        this.setState({ query: query.query });
        if (oldSearchHandler) {
          oldSearchHandler(query);
        }
      };
    }

    const SearchZone = searchZone || [
        <KgSearchBox key={0} size="large" query={this.state.query} {...headerSearchBox}
                     className={styles.searchBox} style={{ height: 36, marginTop: 15 }}
        />,
      ];

    const InfoZone = infoZone || [
        <HeaderInfoZone key={0} app={this.props.app} />,
      ];

    // const { headerSearchBox, user, roles } = this.props.app;
    //
    // // Use default search if not supplied.
    // if (headerSearchBox) {
    //   const oldSearchHandler = headerSearchBox.onSearch;
    //   headerSearchBox.onSearch = (query) => {
    //     this.setState({ query: query.query });
    //     if (oldSearchHandler) {
    //       oldSearchHandler(query);
    //     }
    //   };
    // }
    //
    // if (process.env.NODE_ENV !== 'production' && false) {
    //   const { app } = this.props;
    //   console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    //   console.log('app.user:', app.user);
    //   // console.log('app.token:', app.token ? app.token.slice(0, 10) : app.token);
    //   console.log('app.roles:', app.roles);
    //   console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    // }
    //
    // const menu = (
    //   <Menu style={{ boxShadow: '0 0 1px' }} selectedKeys={[sysconfig.Locale]}>
    //     {locales && locales.map((local) => {
    //       return (
    //         <Menu.Item key={local}>
    //           <span onClick={this.onChangeLocale.bind(this, local)}>
    //             <FM id={`system.lang.option_${local}`}
    //                 defaultMessage={`system.lang.option_${local}`} />
    //           </span>
    //         </Menu.Item>
    //       );
    //     })}
    //   </Menu>
    // );
    //
    // const UserNameBlock = isAuthed(roles)
    //   ? sysconfig.Header_UserNameBlock === defaults.IN_APP_DEFAULT
    //     ? <span>{user.display_name}</span>
    //     : sysconfig.Header_UserNameBlock
    //   : defaults.EMPTY_BLOCK;

    return (
      <Layout.Header className={tc(['header'])}>
        <div className={tc(['logoZone'])}>
          {logoZone && logoZone.length > 0 && logoZone.map(elm => elm)}
        </div>
        <div className={tc(['searchZone'])}>
          {SearchZone && SearchZone.length > 0 && SearchZone.map(elm => elm)}
        </div>
        <div className={tc(['infoZone'])}>
          {InfoZone && InfoZone.length > 0 && InfoZone.map(elm => elm)}
        </div>
      </Layout.Header>
    );
  }
}
