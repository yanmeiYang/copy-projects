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
    <Route exact path="/index.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/index2.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/list.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/login.html" component={require('../login/page.js').default}></Route>
    <Route exact path="/test/test-page.html" component={() => <div>Compiling...</div>}></Route>
    <Route exact path="/" component={() => <div>Compiling...</div>}></Route>
  </Switch>
</Router>
  );
}
