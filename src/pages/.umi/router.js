import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import { default as event, Events } from 'umi/event';


const Router = window.g_CustomRouter || DefaultRouter;

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
    <Route exact path="/expert-map.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/index.html" component={require('../index/page.js').default}></Route>
    <Route exact path="/list.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/login.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/map/career-trajectory.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/map/heatmap.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/search.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/test1.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/test2.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/user/info.html" component={require('../user/info.js').default}></Route>
    <Route exact path="/" component={require('../index/page.js').default}></Route>
  </Switch>
</Router>
  );
}
