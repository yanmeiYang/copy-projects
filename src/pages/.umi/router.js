import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import Layout from '/Users/bogao/develop/aminer/aminer2c/src/layouts/index.js';
import { routerRedux } from 'dva/router';


let Router = DefaultRouter;
const { ConnectedRouter } = routerRedux;
Router = ConnectedRouter;


export default function() {
  return (
<Router history={window.g_history}>
  <Layout><Switch>
    <Route exact path="/auth/forgot-password" component={() => <div>Compiling...</div>} />
    <Route exact path="/expert-map" component={() => <div>Compiling...</div>} />
    <Route exact path="/" component={() => <div>Compiling...</div>} />
    <Route exact path="/list" component={() => <div>Compiling...</div>} />
    <Route exact path="/login" component={require('../login/page.js').default} />
    <Route exact path="/map/career-trajectory" component={() => <div>Compiling...</div>} />
    <Route exact path="/map/heatmap" component={() => <div>Compiling...</div>} />
    <Route exact path="/search" component={() => <div>Compiling...</div>} />
    <Route exact path="/test1" component={() => <div>Compiling...</div>} />
    <Route exact path="/test2" component={() => <div>Compiling...</div>} />
    <Route exact path="/user/info" component={() => <div>Compiling...</div>} />
  </Switch></Layout>
</Router>
  );
}
