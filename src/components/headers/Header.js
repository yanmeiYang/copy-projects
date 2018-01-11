/**
 * Created by BoGao on 2017/9/14.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'engine';
import { Layout } from 'antd';
import { theme, applyTheme } from 'themes';
import { compare } from 'utils';
import { Hole } from 'components/core';
import { KgSearchBox } from 'components/search';
import HeaderInfoZone from './HeaderInfoZone';
import styles from './Header.less';

const tc = applyTheme(styles);

function mapStateToPropsFactory(initialState, ownProps) {
  // a closure for ownProps is created
  return function mapStateToProps(state) {
    return ({ app: state.app });
  };
}

@connect(mapStateToPropsFactory)
export default class Header extends Component {
  static displayName = 'Header';

  static propTypes = {
    logoZone: PropTypes.array,
    searchZone: PropTypes.array,
    infoZone: PropTypes.array,
    rightZone: PropTypes.array,

    fixAdvancedSearch: PropTypes.bool,
    disableAdvancedSearch: PropTypes.bool,
  };

  static defaultProps = {
    logoZone: theme.logoZone,
    searchZone: theme.searchZone,
    infoZone: theme.infoZone,
    fixAdvancedSearch: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (compare(this.props, nextProps,
        'app', 'logoZone', 'searchZone', 'infoZone', 'rightZone', 'fixAdvancedSearch',
      )) {
      return true;
    }
    if (compare(this.state, nextState, 'query')) {
      return true;
    }
    return false;
  }

  // logoutAuth = () => {
  //   this.setState({ logoutLoading: true });
  //   // this.forceUpdate(() => console.log('forceUpdate Done!'));
  //   this.props.logout();
  //   // this.setState({ logoutLoading: false });
  //
  //
  // loginPageUrl = () => {
  //   return location.pathname !== sysconfig.Auth_LoginPage
  //     ? `/login?from=${location.pathname}`
  //     : '/login';
  // };

  render() {

    const { logoZone, searchZone, infoZone, rightZone } = this.props;
    const { onSearch, fixAdvancedSearch, disableAdvancedSearch, query } = this.props;
    // console.log('>>>>>>>HEADER', logoZone, searchZone, infoZone, rightZone);

    return (
      <Layout.Header className={tc(['header'])}>

        <div className={tc(['logoZone'])}>
          <Hole fill={logoZone} />
        </div>

        <div className={tc(['searchZone'])}>
          <Hole fill={searchZone} defaults={[
            <KgSearchBox
              key={100} size="large"
              className={styles.searchBox} style={{ height: 36, marginTop: 15 }}
              query={query} onSearch={onSearch}
              fixAdvancedSearch={fixAdvancedSearch}
              disableAdvancedSearch={disableAdvancedSearch}
            />,
          ]} />
        </div>

        <div className={tc(['infoZone'])}>
          <Hole fill={infoZone} />
        </div>

        <div className={tc(['rightZone'])}>
          <Hole fill={rightZone} defaults={[
            <HeaderInfoZone key={100} app={this.props.app} logout={this.props.logout} />,
          ]} />
        </div>

      </Layout.Header>
    );
  }
}
