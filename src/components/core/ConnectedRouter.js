import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router, Switch, Route, Redirect, routerRedux } from 'dva/router';
import dynamic from 'dva/dynamic';
import { Loader } from 'components/ui';

const { ConnectedRouter } = routerRedux;

export default class Hole extends Component {

  static propTypes = {
    // name: PropTypes.string,
    // fill: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
    // defaults: PropTypes.array,
    // param: PropTypes.object,
    // config: PropTypes.object,
    // other configs.
  };

  static defaultProps = {
    // name: 'HOLE',
  };

  render() {
    const { history, app, routes, RootComponent } = this.props;

    return (
      <ConnectedRouter history={history}>
        {/* v2.0 不使用 RootComponent，在page中引入Root */}
        {/*<RootComponent>*/}
        <Switch>
          {/* <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} /> */}
          {routes.map((route, index) => {
            if (!route) {
              console.log('Error: route #%d is null!', index);
              return false;
            }
            const { path, noExact, ...dynamics } = route;
            const dupKey = `${index}_`;

            if (false && process.env.NODE_ENV !== 'production') {
              console.log(
                '%cRegister Routes: %s %s',
                'color:red;background-color:rgb(255,251,130)',
                !noExact ? '[exact]' : '', path);
            }

            // for Error404 <Route component={error} />
            if (!path) {
              return <Route key={dupKey} component={dynamic({ app, ...dynamics })} />;
              // return <Route key={dupKey} component={error} />;
            }

            // common routes.
            return (
              <Route key={dupKey} exact={!noExact} path={path} component={dynamic({
                app,
                LoadingComponent: ({ productId }) => (<Loader spinning />), // TODO that this?
                ...dynamics,
              })} />
            );
          })}
          {/*<Route component={error} />*/}
        </Switch>
        {/*</RootComponent>*/}
      </ConnectedRouter>
    );

  }
}
