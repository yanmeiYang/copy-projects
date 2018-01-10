import { Router, Route, Switch } from 'umi-router';
import dynamic from 'umi/dynamic';
import { default as event, Events } from 'umi/event';

export default function() {

  function callback(key, err) {
    if (!err) {
      event.emit(Events.PAGE_INITIALIZED, { key });
    }
  }

  return (
<Router history={window.g_history}>
  <Switch>
    <Route exact path="/auth/forgot-password.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/career-trajectory/ExpertHeatmapPage.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/career-trajectory/ExpertTrajectoryPage.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/expert-map.html" component={require('../expert-map/page.js').default}></Route>
    <Route exact path="/index.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/list.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/login.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/search.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/test1.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/test2.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/user/info.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/" component={() => <div>Compiling...</div>}></Route>
  </Switch>
</Router>
  );
}
