/**
 * Created by BoGao on 2017/9/14.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { theme, applyTheme } from 'themes';
import { Layout } from 'antd';
import { KgSearchBox } from 'components/search';
import HeaderInfoZone from 'components/Layout/HeaderInfoZone';
import { compare } from 'utils';
import { hole } from 'core';
import styles from './Header.less';

const tc = applyTheme(styles);

function mapStateToPropsFactory(initialState, ownProps) {
  // a closure for ownProps is created
  // console.log('****** mapStateToPropsFactory',);
  return function mapStateToProps(state) {
    // console.log('****** mapStateToProps',); // TODO Performance
    return ({
      app: {
        user: state.app.user,
        roles: state.app.roles,
        // isAdvancedSearch: state.app.isAdvancedSearch,
      },
    });
  };
}

const mapStateToProps = (state) => {
  // console.log('****** mapStateToProps',); // TODO Performance
  return ({
    app: {
      user: state.app.user,
      roles: state.app.roles,
    },
  });
};

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

  // state = {
  //   query: '',
  // };

  // componentWillReceiveProps = (nextProps) => {
  //   if (nextProps.query !== this.props.query) {
  //     this.setQuery(nextProps.query);
  //   }
  // };

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
  // };
  //
  // loginPageUrl = () => {
  //   return location.pathname !== sysconfig.Auth_LoginPage
  //     ? `/login?from=${location.pathname}`
  //     : '/login';
  // };

  render() {
    // console.log('>>>>>>>HEADER');

    const { logoZone, searchZone, infoZone, rightZone } = this.props;
    const { onSearch, fixAdvancedSearch, disableAdvancedSearch, query, app } = this.props;

    return (
      <Layout.Header className={tc(['header'])}>

        <div className={tc(['logoZone'])}>
          {hole.fill(logoZone)}
        </div>

        <div className={tc(['searchZone'])}>
          {hole.fill(searchZone, [
            <KgSearchBox
              key={100} size="large"
              className={styles.searchBox} style={{ height: 36, marginTop: 15 }}
              query={query} onSearch={onSearch}
              fixAdvancedSearch={fixAdvancedSearch}
              disableAdvancedSearch={disableAdvancedSearch}
            />,
          ])}
        </div>

        <div className={tc(['infoZone'])}>
          {hole.fill(infoZone)}
        </div>

        <div className={tc(['rightZone'])}>
          {hole.fill(rightZone, [
            <HeaderInfoZone key={100} app={this.props.app} logout={this.props.logout} />,
          ])}
        </div>

      </Layout.Header>
    );
  }
}
